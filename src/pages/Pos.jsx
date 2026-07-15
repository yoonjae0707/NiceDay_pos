import React, { useState } from 'react';
import { ShoppingCart, Trash2, Plus, Minus, Banknote, CreditCard } from 'lucide-react';
import { useStore } from '../store';
import './Pos.css';

const Pos = () => {
  const { products, cart, addToCart, removeFromCart, updateCartQuantity, clearCart, checkout, bankAccount } = useStore();
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Cash'); // 'Cash' | 'BankTransfer'

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  const handleOpenCheckout = () => {
    if (cart.length === 0) return;
    setIsModalOpen(true);
  };

  const handleConfirmCheckout = () => {
    checkout(paymentMethod, total);
    setIsModalOpen(false);
    alert('결제가 완료되었으며 영수증이 매출 기록에 저장되었습니다.');
  };

  return (
    <div className="pos-container">
      {/* Products Section */}
      <div className="products-section">
        <h2 className="page-title" style={{ marginBottom: '24px' }}>상품 리스트 (직원용)</h2>
        
        <div className="products-grid">
          {products.map(product => (
            <div 
              key={product.id} 
              className="card product-card"
              onClick={() => addToCart(product)}
            >
              <h3 className="product-name">{product.name}</h3>
              <div className="product-price">{product.price.toLocaleString()}원</div>
              <div className="product-stock">재고: {product.stock}개</div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Section */}
      <div className="cart-section">
        <div className="cart-header">
          <div className="cart-title">
            <ShoppingCart size={20} />
            장바구니
          </div>
          <button className="clear-cart" onClick={clearCart}>전체 삭제</button>
        </div>

        <div className="cart-items">
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '40px' }}>
              장바구니가 비어있습니다.
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-price">{(item.price * item.quantity).toLocaleString()}원</div>
                </div>
                <div className="cart-controls">
                  <button className="qty-btn" onClick={() => updateCartQuantity(item.id, item.quantity - 1)}>
                    <Minus size={14} />
                  </button>
                  <span style={{ fontWeight: '500', width: '20px', textAlign: 'center' }}>{item.quantity}</span>
                  <button className="qty-btn" onClick={() => updateCartQuantity(item.id, item.quantity + 1)}>
                    <Plus size={14} />
                  </button>
                  <button className="qty-btn" style={{ borderColor: 'transparent', color: 'var(--danger)' }} onClick={() => removeFromCart(item.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="cart-footer">
          <div className="summary-row">
            <span>소계</span>
            <span>{subtotal.toLocaleString()}원</span>
          </div>
          <div className="summary-row">
            <span>부가세 (10%)</span>
            <span>{tax.toLocaleString()}원</span>
          </div>
          <div className="summary-row total">
            <span>총 결제금액</span>
            <span>{total.toLocaleString()}원</span>
          </div>
          
          <button 
            className="btn btn-primary checkout-btn" 
            onClick={handleOpenCheckout}
            disabled={cart.length === 0}
            style={{ opacity: cart.length === 0 ? 0.5 : 1 }}
          >
            결제 진행하기
          </button>
        </div>
      </div>

      {/* Checkout Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">결제 확인</h3>
            
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontWeight: 'bold' }}>
                <span>총 결제 금액</span>
                <span style={{ color: 'var(--brand-primary)', fontSize: '1.2rem' }}>{total.toLocaleString()}원</span>
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                결제할 품목: {cart.length}개
              </div>
            </div>

            <div className="payment-options">
              <button 
                className={`payment-btn ${paymentMethod === 'Cash' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('Cash')}
              >
                <Banknote size={24} style={{ margin: '0 auto 8px' }} />
                현금 결제
              </button>
              <button 
                className={`payment-btn ${paymentMethod === 'BankTransfer' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('BankTransfer')}
              >
                <CreditCard size={24} style={{ margin: '0 auto 8px' }} />
                계좌 이체
              </button>
            </div>

            {paymentMethod === 'BankTransfer' && (
              <div className="bank-info">
                {bankAccount ? (
                  <>입금 계좌: {bankAccount}</>
                ) : (
                  <span style={{ color: 'var(--danger)' }}>환경 설정에서 계좌번호를 먼저 등록해주세요.</span>
                )}
              </div>
            )}

            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setIsModalOpen(false)}>취소</button>
              <button 
                className="btn btn-primary" 
                onClick={handleConfirmCheckout}
                disabled={paymentMethod === 'BankTransfer' && !bankAccount}
              >
                최종 결제 승인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pos;
