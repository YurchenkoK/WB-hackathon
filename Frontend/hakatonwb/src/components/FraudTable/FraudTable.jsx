import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './FraudTable.module.css';
import FraudDetailsModal from '../FraudDetailsModal/FraudDetailsModal.jsx';
import NavigationBar from "../NavigationBar/NavigationBar.jsx"; // Добавить этот импорт
import {PATH_Fraud} from '../constans.js';

const FraudTable = () => {
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [data, setData] = useState(null);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(15);
    const [loading, setLoading] = useState(true);

    const PATH = PATH_Fraud

    const refreshData = () => {
        setLoading(true);
        axios.get(`${PATH}/GetAll?pageNumber=${page}&pageSize=${pageSize}`)
            .then(response => {
                setData(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `${PATH}/GetAll?pageNumber=${page}&pageSize=${pageSize}`
                );
                setData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [page, pageSize]);

    if (loading) return <div className={styles.loadingSpinner}>Loading...</div>;

    const handleRowClick = (itemId) => {
        setSelectedItemId(itemId);
        setIsModalOpen(true);
    };

    return (
        <div className={styles.fraudContainer}>
            <NavigationBar refreshData={refreshData} />
            <div className={styles.tableHeader}>
                <h1 className={styles.title}>Fraud Detection Monitoring</h1>
                <div className={styles.paginationControls}>


                    <div className={styles.pageNavigation}>
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className={styles.navButton}
                        >
                            ← Prev
                        </button>
                        <span className={styles.pageInfo}>
              Page {page} of {Math.ceil(data.totalCount / pageSize)}
            </span>
                        <button
                            onClick={() => setPage(p => p + 1)}
                            disabled={page * pageSize >= data.totalCount}
                            className={styles.navButton}
                        >
                            Next →
                        </button>
                    </div>
                </div>
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.fraudTable}>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>User ID</th>
                        <th>Created Date</th>
                        <th>Nm ID</th>
                        <th>Total Ordered</th>
                        <th>Payment Type</th>
                        <th>Paid</th>
                        <th>Count Items</th>
                        <th>Unique Items</th>
                        <th>Avg Unique</th>
                        <th>Courier</th>
                        <th>Nm Age</th>
                        <th>Distance</th>
                        <th>Days After Reg.</th>
                        <th>Orders</th>
                        <th>Ordered Items</th>
                        <th>Mean Items</th>
                        <th>Min Items</th>
                        <th>Max Items</th>
                        <th>Mean %</th>
                        <th>Status</th>
                        <th>Service</th>
                        <th>Confidence</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data.data.map(item => (
                        <tr
                            key={item.id}
                            className={item.target ? styles.highRisk : styles.normal}
                            onClick={() => handleRowClick(item.id)}
                            style={{ cursor: 'pointer' }}
                        >
                            <td>{item.id}</td>
                            <td>{item.userId}</td>
                            <td>{new Date(item.createdDate).toLocaleDateString()}</td>
                            <td>{item.nmId}</td>
                            <td>{item.totalOrdered}</td>
                            <td>
                                  <span className={`${styles.paymentTag} ${styles[item.paymentType.toLowerCase()]}`}>
                                    {item.paymentType}
                                  </span>
                            </td>
                            <td className={styles.statusCell}>
                                <div className={`${styles.statusIndicator} ${item.isPaid ? styles.paid : styles.unpaid}`}>
                                    {item.isPaid ? 'Yes' : 'No'}
                                </div>
                            </td>
                            <td>{item.countItems}</td>
                            <td>{item.uniqueItems}</td>
                            <td>{item.avgUniquePurchase.toFixed(2)}</td>
                            <td className={styles.statusCell}>
                                <div className={`${styles.statusIndicator} ${item.isCourier ? styles.courier : styles.noCourier}`}>
                                    {item.isCourier ? 'Yes' : 'No'}
                                </div>
                            </td>
                            <td>{item.nmAge}</td>
                            <td>{item.distance}</td>
                            <td>{item.daysAfterRegistration}</td>
                            <td>{item.numberOfOrders}</td>
                            <td>{item.numberOfOrderedItems}</td>
                            <td>{item.meanNumberOfOrderedItems.toFixed(1)}</td>
                            <td>{item.minNumberOfOrderedItems}</td>
                            <td>{item.maxNumberOfOrderedItems}</td>
                            <td>
                                <div className={styles.riskMeter}>
                                    <div
                                        className={styles.riskFill}
                                        style={{ width: `${item.meanPercentOfOrderedItems}%` }}
                                    />
                                    <span className={styles.riskValue}>
                                      {item.meanPercentOfOrderedItems.toFixed(1)}%
                                    </span>
                                </div>
                            </td>
                            <td className={styles.statusCell}>
                                <div className={`${styles.statusIndicator} ${item.target ? styles.blocked : styles.clean}`}>
                                    {item.target ? 'Block' : 'OK'}
                                </div>
                            </td>
                            <td>
                                  <span className={styles.serviceTag}>
                                    {item.service}
                                  </span>
                            </td>
                            <td>
                                {item.confidence.toFixed(3)}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            {isModalOpen && (
                <FraudDetailsModal
                    itemId={selectedItemId}
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedItemId(null);
                    }}
                    onUpdate={refreshData}
                />
            )}
        </div>
    );
};

export default FraudTable;