import React, { useState } from 'react';
import { useStore } from '../store';
import './Settings.css';

const Settings = () => {
  const { 
    bankAccount, 
    updateBankAccount, 
    products, 
    setExactStock, 
    deleteProduct, 
    addProduct 
  } = useStore();

  const [accountInput, setAccountInput] = useState(bankAccount);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', category: '', stock: '' });

  const handleSaveAccount = () => {
    updateBankAccount(accountInput);
    alert('계좌번호가 저장되었습니다.');
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;
    
    addProduct({
      name: newProduct.name,
      price: Number(newProduct.price),
      category: newProduct.category || '기타',
      stock: Number(newProduct.stock) || 0
    });
    alert('상품이 추가되었습니다.');
    setNewProduct({ name: '', price: '', category: '', stock: '' });
  };

  const handleStockChange = (id, value) => {
    const num = parseInt(value, 10);
    if (!isNaN(num)) {
      setExactStock(id, num);
    }
  };

  return (
    <div className="settings-container">
      <h2 className="page-title">환경 설정</h2>

      {/* 계좌 설정 */}
      <div className="card settings-section">
        <h3 className="section-title">결제 계좌 설정</h3>
        <div className="action-row">
          <input 
            type="text" 
            className="form-input" 
            placeholder="예: 국민은행 123-456-789012"
            value={accountInput}
            onChange={(e) => setAccountInput(e.target.value)}
            style={{ maxWidth: '400px' }}
          />
          <button className="btn btn-primary" onClick={handleSaveAccount}>저장</button>
        </div>
      </div>

      {/* 새 상품 추가 */}
      <div className="card settings-section">
        <h3 className="section-title">새 상품 추가</h3>
        <form onSubmit={handleAddProduct} className="form-grid">
          <div>
            <label className="form-label">상품명</label>
            <input 
              type="text" 
              className="form-input" 
              required
              value={newProduct.name}
              onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
            />
          </div>
          <div>
            <label className="form-label">가격</label>
            <input 
              type="number" 
              className="form-input" 
              required
              value={newProduct.price}
              onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
            />
          </div>
          <div>
            <label className="form-label">카테고리</label>
            <input 
              type="text" 
              className="form-input" 
              value={newProduct.category}
              onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
            />
          </div>
          <div>
            <label className="form-label">초기 재고</label>
            <input 
              type="number" 
              className="form-input" 
              value={newProduct.stock}
              onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
            />
          </div>
          <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary">상품 추가</button>
          </div>
        </form>
      </div>

      {/* 재고 관리 */}
      <div className="card settings-section">
        <h3 className="section-title">재고 및 상품 관리</h3>
        <table className="inventory-table" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ padding: '12px', borderBottom: '1px solid var(--border-color)' }}>상품명</th>
              <th style={{ padding: '12px', borderBottom: '1px solid var(--border-color)' }}>가격</th>
              <th style={{ padding: '12px', borderBottom: '1px solid var(--border-color)' }}>재고 (직접 입력)</th>
              <th style={{ padding: '12px', borderBottom: '1px solid var(--border-color)', textAlign: 'right' }}>관리</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td style={{ padding: '12px', borderBottom: '1px solid var(--border-color)' }}>{p.name}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid var(--border-color)' }}>{p.price.toLocaleString()}원</td>
                <td style={{ padding: '12px', borderBottom: '1px solid var(--border-color)' }}>
                  <input 
                    type="number"
                    className="form-input stock-input"
                    value={p.stock}
                    onChange={(e) => handleStockChange(p.id, e.target.value)}
                    min="0"
                  />
                </td>
                <td style={{ padding: '12px', borderBottom: '1px solid var(--border-color)', textAlign: 'right' }}>
                  <button 
                    className="btn btn-danger" 
                    style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                    onClick={() => {
                      if(window.confirm(`'${p.name}' 상품을 삭제하시겠습니까?`)) deleteProduct(p.id);
                    }}
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Settings;
