import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell
} from "recharts";
import styles from "./DiagramsPage.module.css";
import {PATH_Fraud} from '../constans.js';

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#a4de6c"];

export default function DiagramsPage() {
    const [data, setData] = useState([]);
    const navigate = useNavigate(); // Хук для навигации

    useEffect(() => {
        fetch(`${PATH_Fraud}/GetAll?pageNumber=1&pageSize=50`, {
            credentials: "include",
        })
            .then((res) => res.json())
            .then((json) => setData(json.data))
            .catch((err) => console.error("Ошибка загрузки данных:", err));
    }, []);

    // Функция для возврата на FraudTable
    const handleGoBack = () => {
        navigate("/"); // Переход на главную страницу
    };

    // Процент блокированных пользователей
    const blockedUsersData = data.reduce((acc, item) => {
        if (item.isPaid === false) {
            acc.blocked += 1;
        }
        acc.total += 1;
        return acc;
    }, { blocked: 0, total: 0 });

    const blockedPercent = ((blockedUsersData.blocked / blockedUsersData.total) * 100).toFixed(2);

    // Процент курьеров
    const couriersData = data.reduce((acc, item) => {
        if (item.isCourier === true) {
            acc.couriers += 1;
        }
        acc.total += 1;
        return acc;
    }, { couriers: 0, total: 0 });

    const couriersPercent = ((couriersData.couriers / couriersData.total) * 100).toFixed(2);

    const paymentStatusData = data.reduce((acc, item) => {
        if (item.isPaid === true) {
            acc.paid += 1;
        } else {
            acc.unpaid += 1;
        }
        return acc;
    }, { paid: 0, unpaid: 0 });

    return (
        <div className={styles.page} data-theme="dark">
            {/* Кнопка для возврата */}
            <button className={styles["button-back"]} onClick={handleGoBack}>
                Вернуться на FraudTable
            </button>

            <h2 className={styles.title}>Аналитика заказов</h2>

            {/* График количества заказанных товаров */}
            <div className={styles.chartContainer}>
                <h3 className={styles.chartTitle}>Количество заказанных товаров</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="userId" label={{ value: 'ID пользователя', position: 'insideBottomRight', offset: -10 }} />
                        <YAxis label={{ value: 'Общее количество заказов', angle: -90, position: 'insideBottomLeft' }} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="totalOrdered" fill="#8884d8" name="Всего заказано" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* График среднего процента заказанных товаров */}
            <div className={styles.chartContainer}>
                <h3 className={styles.chartTitle}>Средний процент заказанных товаров</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="userId" label={{ value: 'ID пользователя', position: 'insideBottomRight', offset: -10 }} />
                        <YAxis label={{ value: 'Процент заказанных товаров', angle: -90, position: 'insideBottomLeft' }} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="meanPercentOfOrderedItems" fill="#82ca9d" name="Процент заказов (%)" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className={styles.chartContainer}>
                <h3 className={styles.chartTitle}>Процент блокированных пользователей</h3>
                <div className={styles.chartWrapper}>
                    <ResponsiveContainer width="30%" height={300}>
                        <PieChart>
                            <Pie
                                data={[
                                    { name: "Блокированные", value: blockedUsersData.blocked },
                                    { name: "Активные", value: blockedUsersData.total - blockedUsersData.blocked },
                                ]}
                                cx="50%"
                                cy="50%"
                                label
                                outerRadius={100}
                                fill="#ff7f50"
                                dataKey="value"
                            >
                                {COLORS.map((color, index) => (
                                    <Cell key={`cell-${index}`} fill={color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                    <p>{`Процент блокированных: ${blockedPercent}%`}</p>
                </div>

                <h3 className={styles.chartTitle}>Процент курьеров</h3>
                <div className={styles.chartWrapper}>
                    <ResponsiveContainer width="30%" height={300}>
                        <PieChart>
                            <Pie
                                data={[
                                    { name: "Курьеры", value: couriersData.couriers },
                                    { name: "Не курьеры", value: couriersData.total - couriersData.couriers },
                                ]}
                                cx="50%"
                                cy="50%"
                                label
                                outerRadius={100}
                                fill="#a4de6c"
                                dataKey="value"
                            >
                                {COLORS.map((color, index) => (
                                    <Cell key={`cell-${index}`} fill={color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                    <p>{`Процент курьеров: ${couriersPercent}%`}</p>
                </div>

                <h3 className={styles.chartTitle}>Статус оплаты</h3>
                <div className={styles.chartWrapper}>
                    <ResponsiveContainer width="30%" height={300}>
                        <PieChart>
                            <Pie
                                data={[
                                    { name: "Оплачено", value: paymentStatusData.paid },
                                    { name: "Не оплачено", value: paymentStatusData.unpaid },
                                ]}
                                cx="50%"
                                cy="50%"
                                label
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {COLORS.map((color, index) => (
                                    <Cell key={`cell-${index}`} fill={color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                    <p>{`Процент оплаченных: ${(paymentStatusData.paid / data.length * 100).toFixed(2)}%`}</p>
                </div>
            </div>
        </div>
    );
}
