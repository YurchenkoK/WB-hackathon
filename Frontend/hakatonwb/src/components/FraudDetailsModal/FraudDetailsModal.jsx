import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../FraudTable/FraudTable.module.css';
import {PATH_Fraud} from '../constans.js';

const FraudDetailsModal = ({ itemId, onClose, onUpdate }) => {
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [saveLoading, setSaveLoading] = useState(false);

    const [deleteLoading, setDeleteLoading] = useState(false);

    const PATH = PATH_Fraud

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this record?')) return;

        setDeleteLoading(true);
        try {
            await axios.delete(
                `${PATH}/Delete/${itemId}`
            );
            onUpdate?.();
            onClose?.();
        } catch (error) {
            console.error('Error deleting data:', error);
        } finally {
            setDeleteLoading(false);
        }
    };

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await axios.get(
                    `${PATH}/GetById/${itemId}`
                );
                setDetails(response.data);
                setFormData(response.data);
            } catch (error) {
                console.error('Error fetching details:', error);
            } finally {
                setLoading(false);
            }
        };

        if (itemId) fetchDetails();
    }, [itemId]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSave = async () => {
        setSaveLoading(true);
        try {
            await axios.put(
                `${PATH}/Update/${itemId}`,
                formData
            );
            setIsEditing(false);
            setDetails(formData);
            onUpdate?.();
        } catch (error) {
            console.error('Error updating data:', error);
        } finally {
            setSaveLoading(false);
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <button className={styles.closeButton} onClick={onClose}>×</button>

                {loading ? (
                    <div className={styles.loadingSpinner}>Loading details...</div>
                ) : (
                    <>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>Transaction Details</h2>
                            <div className={styles.modalActionsTop}>
                                {!isEditing && (
                                    <>
                                        <button
                                            className={styles.editButton}
                                            onClick={() => setIsEditing(true)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className={styles.deleteButton}
                                            onClick={handleDelete}
                                            disabled={deleteLoading}
                                        >
                                            {deleteLoading ? 'Deleting...' : 'Delete'}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className={styles.detailsGrid}>
                            {/* ID */}
                            <div className={styles.detailItem}>
                                <span>ID:</span>
                                {isEditing ? (
                                    <input
                                        name="id"
                                        value={formData.id}
                                        className={styles.editInput}
                                        disabled
                                    />
                                ) : (
                                    <strong>{details.id}</strong>
                                )}
                            </div>

                            {/* User ID */}
                            <div className={styles.detailItem}>
                                <span>User ID:</span>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        name="userId"
                                        value={formData.userId}
                                        onChange={handleInputChange}
                                        className={styles.editInput}
                                    />
                                ) : (
                                    <strong>{details.userId}</strong>
                                )}
                            </div>

                            {/* Created Date */}
                            <div className={styles.detailItem}>
                                <span>Created Date:</span>
                                {isEditing ? (
                                    <input
                                        type="datetime-local"
                                        name="createdDate"
                                        value={new Date(formData.createdDate).toISOString().slice(0,16)}
                                        onChange={handleInputChange}
                                        className={styles.editInput}
                                    />
                                ) : (
                                    new Date(details.createdDate).toLocaleString()
                                )}
                            </div>

                            {/* Nm ID */}
                            <div className={styles.detailItem}>
                                <span>Nm ID:</span>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        name="nmId"
                                        value={formData.nmId}
                                        onChange={handleInputChange}
                                        className={styles.editInput}
                                    />
                                ) : (
                                    <strong>{details.nmId}</strong>
                                )}
                            </div>

                            {/* Total Ordered */}
                            <div className={styles.detailItem}>
                                <span>Total Ordered:</span>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        name="totalOrdered"
                                        value={formData.totalOrdered}
                                        onChange={handleInputChange}
                                        className={styles.editInput}
                                    />
                                ) : (
                                    <strong>{details.totalOrdered}</strong>
                                )}
                            </div>

                            {/* Payment Type */}
                            <div className={styles.detailItem}>
                                <span>Payment Type:</span>
                                {isEditing ? (
                                    <select
                                        name="paymentType"
                                        value={formData.paymentType}
                                        onChange={handleInputChange}
                                        className={styles.editSelect}
                                    >
                                        <option value="QRS">QRS</option>
                                        <option value="CRD">CRD</option>
                                        <option value="CSH">CSH</option>
                                        <option value="BAL">BAL</option>
                                    </select>
                                ) : (
                                    <span className={`${styles.paymentTag} ${styles[details.paymentType.toLowerCase()]}`}>
                                        {details.paymentType}
                                    </span>
                                )}
                            </div>

                            {/* Is Paid */}
                            <div className={styles.detailItem}>
                                <span>Paid:</span>
                                {isEditing ? (
                                    <input
                                        type="checkbox"
                                        name="isPaid"
                                        checked={formData.isPaid}
                                        onChange={handleInputChange}
                                        className={styles.editCheckbox}
                                    />
                                ) : (
                                    <div className={`${styles.statusIndicator} ${details.isPaid ? styles.paid : styles.unpaid}`}>
                                        {details.isPaid ? 'Yes' : 'No'}
                                    </div>
                                )}
                            </div>

                            {/* Count Items */}
                            <div className={styles.detailItem}>
                                <span>Count Items:</span>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        name="countItems"
                                        value={formData.countItems}
                                        onChange={handleInputChange}
                                        className={styles.editInput}
                                    />
                                ) : (
                                    <strong>{details.countItems}</strong>
                                )}
                            </div>

                            {/* Unique Items */}
                            <div className={styles.detailItem}>
                                <span>Unique Items:</span>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        name="uniqueItems"
                                        value={formData.uniqueItems}
                                        onChange={handleInputChange}
                                        className={styles.editInput}
                                    />
                                ) : (
                                    <strong>{details.uniqueItems}</strong>
                                )}
                            </div>

                            {/* Avg Unique Purchase */}
                            <div className={styles.detailItem}>
                                <span>Avg Unique Purchase:</span>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="avgUniquePurchase"
                                        value={formData.avgUniquePurchase}
                                        onChange={handleInputChange}
                                        className={styles.editInput}
                                    />
                                ) : (
                                    <strong>{details.avgUniquePurchase.toFixed(2)}</strong>
                                )}
                            </div>

                            {/* Is Courier */}
                            <div className={styles.detailItem}>
                                <span>Courier:</span>
                                {isEditing ? (
                                    <input
                                        type="checkbox"
                                        name="isCourier"
                                        checked={formData.isCourier}
                                        onChange={handleInputChange}
                                        className={styles.editCheckbox}
                                    />
                                ) : (
                                    <div className={`${styles.statusIndicator} ${details.isCourier ? styles.courier : styles.noCourier}`}>
                                        {details.isCourier ? 'Yes' : 'No'}
                                    </div>
                                )}
                            </div>

                            {/* Nm Age */}
                            <div className={styles.detailItem}>
                                <span>Nm Age:</span>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        name="nmAge"
                                        value={formData.nmAge}
                                        onChange={handleInputChange}
                                        className={styles.editInput}
                                    />
                                ) : (
                                    <strong>{details.nmAge}</strong>
                                )}
                            </div>

                            {/* Distance */}
                            <div className={styles.detailItem}>
                                <span>Distance:</span>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        name="distance"
                                        value={formData.distance}
                                        onChange={handleInputChange}
                                        className={styles.editInput}
                                    />
                                ) : (
                                    <strong>{details.distance}</strong>
                                )}
                            </div>

                            {/* Days After Registration */}
                            <div className={styles.detailItem}>
                                <span>Days After Reg.:</span>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        name="daysAfterRegistration"
                                        value={formData.daysAfterRegistration}
                                        onChange={handleInputChange}
                                        className={styles.editInput}
                                    />
                                ) : (
                                    <strong>{details.daysAfterRegistration}</strong>
                                )}
                            </div>

                            {/* Number of Orders */}
                            <div className={styles.detailItem}>
                                <span>Orders:</span>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        name="numberOfOrders"
                                        value={formData.numberOfOrders}
                                        onChange={handleInputChange}
                                        className={styles.editInput}
                                    />
                                ) : (
                                    <strong>{details.numberOfOrders}</strong>
                                )}
                            </div>

                            {/* Ordered Items */}
                            <div className={styles.detailItem}>
                                <span>Ordered Items:</span>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        name="numberOfOrderedItems"
                                        value={formData.numberOfOrderedItems}
                                        onChange={handleInputChange}
                                        className={styles.editInput}
                                    />
                                ) : (
                                    <strong>{details.numberOfOrderedItems}</strong>
                                )}
                            </div>

                            {/* Mean Ordered Items */}
                            <div className={styles.detailItem}>
                                <span>Mean Items:</span>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        step="0.1"
                                        name="meanNumberOfOrderedItems"
                                        value={formData.meanNumberOfOrderedItems}
                                        onChange={handleInputChange}
                                        className={styles.editInput}
                                    />
                                ) : (
                                    <strong>{details.meanNumberOfOrderedItems.toFixed(1)}</strong>
                                )}
                            </div>

                            {/* Min Items */}
                            <div className={styles.detailItem}>
                                <span>Min Items:</span>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        name="minNumberOfOrderedItems"
                                        value={formData.minNumberOfOrderedItems}
                                        onChange={handleInputChange}
                                        className={styles.editInput}
                                    />
                                ) : (
                                    <strong>{details.minNumberOfOrderedItems}</strong>
                                )}
                            </div>

                            {/* Max Items */}
                            <div className={styles.detailItem}>
                                <span>Max Items:</span>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        name="maxNumberOfOrderedItems"
                                        value={formData.maxNumberOfOrderedItems}
                                        onChange={handleInputChange}
                                        className={styles.editInput}
                                    />
                                ) : (
                                    <strong>{details.maxNumberOfOrderedItems}</strong>
                                )}
                            </div>

                            {/* Risk Level */}
                            <div className={styles.detailItem}>
                                <span>Risk Level:</span>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        step="0.1"
                                        name="meanPercentOfOrderedItems"
                                        value={formData.meanPercentOfOrderedItems}
                                        onChange={handleInputChange}
                                        className={styles.editInput}
                                    />
                                ) : (
                                    <div className={styles.riskMeter}>
                                        <div
                                            className={styles.riskFill}
                                            style={{ width: `${details.meanPercentOfOrderedItems}%` }}
                                        />
                                        <span className={styles.riskValue}>
                                            {details.meanPercentOfOrderedItems.toFixed(1)}%
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Status */}
                            <div className={styles.detailItem}>
                                <span>Status:</span>
                                {isEditing ? (
                                    <select
                                        name="target"
                                        value={formData.target}
                                        onChange={handleInputChange}
                                        className={styles.editSelect}
                                    >
                                        <option value={0}>OK</option>
                                        <option value={1}>Block</option>
                                    </select>
                                ) : (
                                    <div className={`${styles.statusIndicator} ${details.target ? styles.blocked : styles.clean}`}>
                                        {details.target ? 'Block' : 'OK'}
                                    </div>
                                )}
                            </div>

                            {/* Service */}
                            <div className={styles.detailItem}>
                                <span>Service:</span>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="service"
                                        value={formData.service}
                                        onChange={handleInputChange}
                                        className={styles.editInput}
                                    />
                                ) : (
                                    <span className={styles.serviceTag}>
                                        {details.service}
                                    </span>
                                )}
                            </div>

                            {/* Action Buttons */}
                            {isEditing && (
                                <div className={styles.modalActions}>
                                    <button
                                        className={styles.cancelButton}
                                        onClick={() => {
                                            setIsEditing(false);
                                            setFormData(details);
                                        }}
                                        disabled={saveLoading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className={styles.saveButton}
                                        onClick={handleSave}
                                        disabled={saveLoading}
                                    >
                                        {saveLoading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default FraudDetailsModal;