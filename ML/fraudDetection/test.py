import os

import pandas as pd
from catboost import CatBoostClassifier, Pool
from dateutil import parser
import numpy as np

cb_model = NotImplemented


# 3 Фуннкции для времени
def time_fix(time_obj):
    time_obj = parser.isoparse(time_obj)
    return time_obj.timestamp()


def time_to_agregates(df):
    df['CreatedDate'] = df['CreatedDate'].apply(lambda x: time_fix(x))
    df['CreatedDate'] = df['CreatedDate'].astype(int)

    df['CreatedDate'] = pd.to_datetime(df['CreatedDate'], unit='s')
    df['dayofweek'] = df['CreatedDate'].dt.weekday
    df['hour'] = df['CreatedDate'].dt.hour
    return df


def add_user_aggregates(df):
    """
    df: DataFrame, обязателен столбец 'user_id' и 'CreatedDate' dtype datetime64,
        а также признаки 'number_of_orders', 'total_ordered', 'Distance'.
    Возвращает df с новыми колонками user_* и rolling-агрегатами.
    """
    df = df.copy()
    # для всех user-level _sum/_mean/_max агрегатов
    agg = df.groupby('user_id').agg(
        user_number_of_orders_sum=('number_of_orders', 'sum'),
        user_total_ordered_sum=('total_ordered', 'sum'),
        user_distance_mean=('Distance', 'mean'),
        user_distance_max=('Distance', 'max'),
    )
    df = df.merge(agg, on='user_id', how='left')

    # сортируем для каждого пользователя по времени
    df = df.sort_values(['user_id', 'CreatedDate'])

    # вычисляем промежуток до предыдущего заказа (в днях)
    df['time_since_last_order'] = (
            df.groupby('user_id')['CreatedDate']
            .diff()
            .dt.total_seconds()
            / 86400.0
    )
    # первый заказ пользователя — заполним медианой
    median_delta = df['time_since_last_order'].median()
    df['time_since_last_order'] = df['time_since_last_order'].fillna(median_delta)

    # rolling-агрегации: orders за последние 7 и 30 дней
    def rolling_count(x, window_days):
        # x — серия числа заказов, индекс — CreatedDate
        return x.rolling(window=f'{window_days}d').sum()

    # для корректного rolling нужно установить CreatedDate как индекс внутри группы
    rolled_list = []
    for user, grp in df.groupby('user_id'):
        grp = grp.set_index('CreatedDate')
        grp['orders_last_7d'] = rolling_count(grp['number_of_orders'], 7)
        grp['orders_last_30d'] = rolling_count(grp['number_of_orders'], 30)
        # вернуть в обычный вид
        grp = grp.reset_index()
        rolled_list.append(grp)
    df = pd.concat(rolled_list, ignore_index=True)

    # Если вдруг появятся NaN из-за очень ранних точек, заполним нулями
    df['orders_last_7d'] = df['orders_last_7d'].fillna(0)
    df['orders_last_30d'] = df['orders_last_30d'].fillna(0)

    return df


def userLevelLog(df):
    my_df = df.copy()
    # каппим на 99-й перцентиль, чтобы убрать экстремальные хвосты
    p99 = df['user_total_ordered_sum'].quantile(0.99)
    df['user_total_ordered_sum_capped'] = df['user_total_ordered_sum'].clip(upper=p99)

    # логарифмирование сгладит разброс дальше
    df['user_total_ordered_sum_log'] = np.log1p(df['user_total_ordered_sum_capped'])
    df = df.drop(columns=['user_total_ordered_sum', 'user_total_ordered_sum_capped'])
    df['user_number_of_orders_sum'] = np.log1p(df['user_number_of_orders_sum'])
    df['ratio_order_to_user_mean'] = df['total_ordered'] / (1 + df['mean_number_of_ordered_items'])
    df['diff_order_minus_user_mean'] = df['total_ordered'] - df['mean_number_of_ordered_items']
    df['order_vs_30d'] = df['total_ordered'] / (1 + df['orders_last_30d'])

    return my_df

def payment_type_fix(df):
    df['PaymentType'] = df['PaymentType'].apply(
        lambda x: 'RARE' if x not in ['CSH', 'CRD']
    else x)
    return df


def service_fix(df):
     df['service'] = df['service'].apply(lambda x: 1 if x == 'ordo' else 0)
     return df


def age_fix(df):
     df['NmAge'] = df['NmAge'].apply(lambda x: x if x > 20000 else x-20000)
     return df

def adapt_df(df):
    df = time_to_agregates(df)
    df = add_user_aggregates(df)
    df = userLevelLog(df)
    df = payment_type_fix(df)
    df = service_fix(df)
    df = age_fix(df)

    df = df.drop(columns=['user_id', 'nm_id', 'CreatedDate', 'is_courier', 'min_number_of_ordered_items'])
    return df

def load_model():
    global cb_model
    try:
        print("Current working directory:", os.getcwd())
        print("Files in directory:", os.listdir())
        print("Trying to load model...")

        cb_model = CatBoostClassifier()
        cb_model.load_model("model906.cbm")

        print("Model loaded successfully!")
        print("Model classes:", cb_model.classes_)

    except Exception as e:
        print(f"!!! CRITICAL ERROR LOADING MODEL: {str(e)} !!!")
        raise


def func(data_json):
    load_model()
    data = pd.read_json(data_json)
    rename_dict = {
        'createdDate': 'CreatedDate',
        'userId': 'user_id',
        'paymentType': 'PaymentType',
        'isPaid': 'IsPaid',
        'countItems': 'count_items',
        'uniqueItems': 'unique_items',
        'avgUniquePurchase': 'avg_unique_purchase',
        'nmAge': 'NmAge',
        'distance': 'Distance',
        'daysAfterRegistration': 'DaysAfterRegistration',
        'numberOfOrders': 'number_of_orders',
        'numberOfOrderedItems': 'number_of_ordered_items',
        'meanNumberOfOrderedItems': 'mean_number_of_ordered_items',
        'minNumberOfOrderedItems': 'min_number_of_ordered_items',
        'maxNumberOfOrderedItems': 'max_number_of_ordered_items',
        'meanPercentOfOrderedItems': 'mean_percent_of_ordered_items',
        'service': 'service',
        'totalOrdered': 'total_ordered',
        'target': 'target',
        'isCourier': 'is_courier',
        'nmId': 'nm_id'
    }
    data = data.rename(columns=rename_dict)
    ids = data['id']
    data = data.drop(columns=['id'])
    data = adapt_df(data)
    expected_columns = [
        'service', 'total_ordered', 'PaymentType', 'IsPaid', 'count_items',
        'unique_items', 'avg_unique_purchase', 'NmAge', 'Distance',
        'DaysAfterRegistration', 'number_of_orders', 'number_of_ordered_items',
        'mean_number_of_ordered_items', 'max_number_of_ordered_items',
        'mean_percent_of_ordered_items', 'target', 'dayofweek', 'hour',
        'user_number_of_orders_sum', 'user_total_ordered_sum',
        'user_distance_mean', 'user_distance_max', 'time_since_last_order',
        'orders_last_7d', 'orders_last_30d'
    ]
    data = data[expected_columns]
    pool = Pool(data, cat_features=['PaymentType', 'service', 'IsPaid', 'dayofweek', 'hour'])
    y_test_proba = cb_model.predict_proba(pool)[:, 1]
    y_pred = (y_test_proba >= 0.45).astype(int)
    frame = pd.DataFrame({
        'id': ids,
        'prediction': y_pred,
        'confidence': y_test_proba[:, 1] if y_test_proba.ndim == 2 else y_test_proba
    })
    json_data = frame.to_json(orient='records')

    return json_data