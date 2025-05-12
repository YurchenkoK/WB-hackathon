import { useState } from 'react';
import axios from 'axios';
import styles from './NavigationBar.module.css';
import {Link} from "react-router-dom";
import {PATH_Fraud} from '../constans.js';

const NavigationBar = ({ refreshData }) => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [newItem, setNewItem] = useState({
        userId: 0,
        nmId: 0,
        totalOrdered: 0,
        paymentType: 'CARD',
        isPaid: true,
        countItems: 0,
        uniqueItems: 0,
        avgUniquePurchase: 0,
        isCourier: true,
        nmAge: 0,
        distance: 0,
        daysAfterRegistration: 0,
        numberOfOrders: 0,
        numberOfOrderedItems: 0,
        meanNumberOfOrderedItems: 0,
        minNumberOfOrderedItems: 0,
        maxNumberOfOrderedItems: 0,
        meanPercentOfOrderedItems: 0,
        service: 'string'
    });

    const PATH = PATH_Fraud

    const handleAddNew = () => setShowAddForm(true);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
            alert('Please upload a CSV file');
            return;
        }

        setUploadLoading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            await axios.post(
                `${PATH}/ImportCsv`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            refreshData();
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Error uploading file: ' + (error.response?.data || error.message));
        } finally {
            setUploadLoading(false);
            e.target.value = ''; // Сброс input файла
        }
    };

    const handleDeleteAll = async () => {
        if (!window.confirm('Are you sure you want to delete ALL records?')) return;
        setUploadLoading(true);
        try {
            await axios.delete(`${PATH}/DeleteAll`);
            refreshData();
        } catch (error) {
            console.error('Error deleting all data:', error);
        } finally {
            setUploadLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${PATH}/Create`, newItem);
            setShowAddForm(false);
            refreshData();
        } catch (error) {
            console.error('Error creating new item:', error);
        }
    };

    return (
        <nav className={styles.navBar}>
            <div className={styles.navGroup}>
                <button onClick={handleAddNew} className={styles.addButton}>
                    Добавить
                </button>
                <label className={styles.fileUploadButton}>
                    <input
                        type="file"
                        onChange={handleFileUpload}
                        hidden
                        accept=".csv"
                        disabled={uploadLoading}
                    />
                    {uploadLoading ? 'Uploading...' : 'Добавить CSV'}
                </label>
                <button onClick={handleDeleteAll} className={styles.deleteButton}>
                    Удалить все
                </button>
                <Link to="/diagrams" className={styles.buttonLink}>
                    Перейти к диаграммам
                </Link>
            </div>

            {showAddForm && (
                <div className={styles.addFormOverlay}>
                    <div className={styles.addForm}>
                        <h2>Add New Transaction</h2>
                        <form onSubmit={handleSubmit}>
                            <div className={styles.formGrid}>
                                {/* User Section */}
                                <div className={styles.formField}>
                                    <label>User ID:</label>
                                    <input
                                        type="number"
                                        value={newItem.userId}
                                        onChange={e => setNewItem({...newItem, userId: e.target.valueAsNumber})}
                                            />
                                            </div>

                                            <div className={styles.formField}>
                                        <label>Nm ID:</label>
                                        <input
                                            type="number"
                                            value={newItem.nmId}
                                            onChange={e => setNewItem({...newItem, nmId: e.target.valueAsNumber})}
                                        />
                                </div>

                                {/* Order Details */}
                                <div className={styles.formField}>
                                    <label>Total Ordered:</label>
                                    <input
                                        type="number"
                                        value={newItem.totalOrdered}
                                        onChange={e => setNewItem({...newItem, totalOrdered: e.target.valueAsNumber})}
                                    />
                                </div>

                                <div className={styles.formField}>
                                    <label>Payment Type:</label>
                                    <select
                                        value={newItem.paymentType}
                                        onChange={e => setNewItem({...newItem, paymentType: e.target.value})}
                                    >
                                        <option value="QRS">QRS</option>
                                        <option value="CRD">CRD</option>
                                        <option value="CSH">CSH</option>
                                        <option value="BAL">BAL</option>
                                    </select>
                                </div>

                                <div className={styles.formField}>
                                    <label>Paid:</label>
                                    <input
                                        type="checkbox"
                                        checked={newItem.isPaid}
                                        onChange={e => setNewItem({...newItem, isPaid: e.target.checked})}
                                    />
                                </div>

                                {/* Items Info */}
                                <div className={styles.formField}>
                                    <label>Count Items:</label>
                                    <input
                                        type="number"
                                        value={newItem.countItems}
                                        onChange={e => setNewItem({...newItem, countItems: e.target.valueAsNumber})}
                                    />
                                </div>

                                <div className={styles.formField}>
                                    <label>Unique Items:</label>
                                    <input
                                        type="number"
                                        value={newItem.uniqueItems}
                                        onChange={e => setNewItem({...newItem, uniqueItems: e.target.valueAsNumber})}
                                    />
                                </div>

                                <div className={styles.formField}>
                                    <label>Avg Unique Purchase:</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={newItem.avgUniquePurchase}
                                        onChange={e => setNewItem({...newItem, avgUniquePurchase: e.target.valueAsNumber})}
                                    />
                                </div>

                                {/* Delivery Info */}
                                <div className={styles.formField}>
                                    <label>Courier:</label>
                                    <input
                                        type="checkbox"
                                        checked={newItem.isCourier}
                                        onChange={e => setNewItem({...newItem, isCourier: e.target.checked})}
                                    />
                                </div>

                                {/* Product Info */}
                                <div className={styles.formField}>
                                    <label>Nm Age:</label>
                                    <input
                                        type="number"
                                        value={newItem.nmAge}
                                        onChange={e => setNewItem({...newItem, nmAge: e.target.valueAsNumber})}
                                    />
                                </div>

                                <div className={styles.formField}>
                                    <label>Distance:</label>
                                    <input
                                        type="number"
                                        value={newItem.distance}
                                        onChange={e => setNewItem({...newItem, distance: e.target.valueAsNumber})}
                                    />
                                </div>

                                {/* Registration Info */}
                                <div className={styles.formField}>
                                    <label>Days After Reg.:</label>
                                    <input
                                        type="number"
                                        value={newItem.daysAfterRegistration}
                                        onChange={e => setNewItem({...newItem, daysAfterRegistration: e.target.valueAsNumber})}
                                    />
                                </div>

                                {/* Order Stats */}
                                <div className={styles.formField}>
                                    <label>Number of Orders:</label>
                                    <input
                                        type="number"
                                        value={newItem.numberOfOrders}
                                        onChange={e => setNewItem({...newItem, numberOfOrders: e.target.valueAsNumber})}
                                    />
                                </div>

                                <div className={styles.formField}>
                                    <label>Ordered Items:</label>
                                    <input
                                        type="number"
                                        value={newItem.numberOfOrderedItems}
                                        onChange={e => setNewItem({...newItem, numberOfOrderedItems: e.target.valueAsNumber})}
                                    />
                                </div>

                                {/* Items Statistics */}
                                <div className={styles.formField}>
                                    <label>Mean Items:</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={newItem.meanNumberOfOrderedItems}
                                        onChange={e => setNewItem({...newItem, meanNumberOfOrderedItems: e.target.valueAsNumber})}
                                    />
                                </div>

                                <div className={styles.formField}>
                                    <label>Min Items:</label>
                                    <input
                                        type="number"
                                        value={newItem.minNumberOfOrderedItems}
                                        onChange={e => setNewItem({...newItem, minNumberOfOrderedItems: e.target.valueAsNumber})}
                                    />
                                </div>

                                <div className={styles.formField}>
                                    <label>Max Items:</label>
                                    <input
                                        type="number"
                                        value={newItem.maxNumberOfOrderedItems}
                                        onChange={e => setNewItem({...newItem, maxNumberOfOrderedItems: e.target.valueAsNumber})}
                                    />
                                </div>

                                {/* Risk Analysis */}
                                <div className={styles.formField}>
                                    <label>Risk Level (%):</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={newItem.meanPercentOfOrderedItems}
                                        onChange={e => setNewItem({...newItem, meanPercentOfOrderedItems: e.target.valueAsNumber})}
                                    />
                                </div>


                                {/* Service Info */}
                                <div className={styles.formField}>
                                    <label>Service:</label>
                                    <input
                                        type="text"
                                        value={newItem.service}
                                        onChange={e => setNewItem({...newItem, service: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className={styles.formActions}>
                                <button
                                    type="button"
                                    className={styles.cancelButton}
                                    onClick={() => setShowAddForm(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className={styles.saveButton}
                                >
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                )}
            {uploadLoading && (
                <div className={styles.fullscreenOverlay}>
                    <div style={{ textAlign: "center" }}>
                        <div className={styles.loader}></div>
                        <p style={{ color: "#fff", marginTop: "1rem", fontSize: "18px" }}>Загрузка...</p>
                    </div>
                </div>

            )}
        </nav>
    );
};

export default NavigationBar;