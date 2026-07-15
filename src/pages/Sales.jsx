import React from 'react';
import { useStore } from '../store';
import { Trash2 } from 'lucide-react';
import './Sales.css';

const Sales = () => {
  const { salesRecords, deleteSalesRecord, clearAllSalesRecords } = useStore();

  const handleClearAll = () => {
    if (window.confirm('모든 매출 기록을 정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      clearAllSalesRecords();
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('이 매출 기록을 삭제하시겠습니까?')) {
      deleteSalesRecord(id);
    }
  };

  const formatDate = (isoString) => {
    const d = new Date(isoString);
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <div className="sales-container">
      <div className="sales-header">
        <h2 className="page-title">매출 기록</h2>
        {salesRecords.length > 0 && (
          <button className="btn btn-outline" onClick={handleClearAll} style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}>
            전체 기록 삭제
          </button>
        )}
      </div>

      {salesRecords.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-secondary)' }}>
          매출 기록이 없습니다.
        </div>
      ) : (
        salesRecords.map(record => (
          <div key={record.id} className="card receipt-card">
            <div className="receipt-header">
              <span className="receipt-time">{formatDate(record.timestamp)}</span>
              <span className="receipt-method">
                {record.paymentMethod === 'Cash' ? '현금 결제' : '계좌 이체'}
              </span>
            </div>
            
            <div className="receipt-items">
              {record.items.map(item => (
                <div key={item.id} className="receipt-item-row">
                  <span>{item.name} x {item.quantity}</span>
                  <span>{(item.price * item.quantity).toLocaleString()}원</span>
                </div>
              ))}
            </div>
            
            <div className="receipt-footer">
              <div className="receipt-total">
                총 {record.total.toLocaleString()}원
              </div>
              <button 
                className="btn" 
                style={{ color: 'var(--danger)', padding: '8px' }}
                onClick={() => handleDelete(record.id)}
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Sales;
