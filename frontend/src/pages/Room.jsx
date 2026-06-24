import { useState, useEffect } from 'react';
import api from '../api/axios';

// Each furniture item is drawn using CSS box-shadow pixel art technique
const SHOP_ITEMS = [
  { id: 'desk', name: 'Pixel Desk', cost: 30, emoji: '🖥️' },
  { id: 'plant', name: 'Cactus', cost: 20, emoji: '🌵' },
  { id: 'lamp', name: 'Lamp', cost: 15, emoji: '💡' },
  { id: 'cat', name: 'Cat', cost: 50, emoji: '🐱' },
  { id: 'bookshelf', name: 'Bookshelf', cost: 40, emoji: '📚' },
  { id: 'rug', name: 'Rug', cost: 25, emoji: '🟥' },

  // 🛏️ Bedroom items
  { id: 'bed_single', name: 'Single Bed', cost: 60, emoji: '🛏️' },
  { id: 'bed_double', name: 'Double Bed', cost: 90, emoji: '🛏️' },
  { id: 'sofa_bed', name: 'Sofa Bed', cost: 85, emoji: '🛋️' },
  { id: 'mattress', name: 'Mattress', cost: 35, emoji: '🛌' },
  { id: 'pillow_set', name: 'Pillow Set', cost: 10, emoji: '🪶' },
  { id: 'blanket', name: 'Blanket', cost: 20, emoji: '🧺' },

  // 🪟 Curtains
  { id: 'curtain_blackout', name: 'Blackout Curtain', cost: 25, emoji: '🪟' },
  { id: 'curtain_sheer', name: 'Sheer Curtain', cost: 18, emoji: '🪟' },
  { id: 'curtain_printed', name: 'Printed Curtain', cost: 22, emoji: '🪟' },
  { id: 'door_curtain', name: 'Door Curtain', cost: 20, emoji: '🚪' },

  // 📚 Study / Work
  { id: 'study_table', name: 'Study Table', cost: 45, emoji: '📖' },
  { id: 'laptop_table', name: 'Laptop Table', cost: 30, emoji: '💻' },
  { id: 'gaming_desk', name: 'Gaming Desk', cost: 70, emoji: '🎮' },
  { id: 'chair_ergonomic', name: 'Ergonomic Chair', cost: 55, emoji: '🪑' },

  // 🌿 Plants & Flowers
  { id: 'money_plant', name: 'Money Plant', cost: 15, emoji: '🌿' },
  { id: 'snake_plant', name: 'Snake Plant', cost: 20, emoji: '🌱' },
  { id: 'peace_lily', name: 'Peace Lily', cost: 25, emoji: '🌸' },
  { id: 'bonsai', name: 'Bonsai', cost: 60, emoji: '🌳' },
  { id: 'succulent_set', name: 'Succulent Set', cost: 18, emoji: '🪴' },

  // 🪴 Pots & Decor
  { id: 'ceramic_pot', name: 'Ceramic Pot', cost: 12, emoji: '🏺' },
  { id: 'hanging_pot', name: 'Hanging Pot', cost: 14, emoji: '🪢' },
  { id: 'flower_vase', name: 'Flower Vase', cost: 16, emoji: '🌷' },
  { id: 'artificial_flowers', name: 'Artificial Flowers', cost: 10, emoji: '💐' }
];

// Pixel positions for each item in the room grid (16x12 grid)
const ITEM_POSITIONS = {
  desk:      { top: '40%', left: '60%' },
  plant:     { top: '20%', left: '10%' },
  lamp:      { top: '15%', left: '75%' },
  cat:       { top: '60%', left: '40%' },
  bookshelf: { top: '20%', left: '30%' },
  rug:       { top: '65%', left: '45%' },
};

export default function Room() {
  const [points, setPoints] = useState(0);
  const [ownedItems, setOwnedItems] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const res = await api.get('/room');
    setPoints(res.data.points || 0);
    setOwnedItems(res.data.room?.items || []);
  };

  const buyItem = async (item) => {
    if (points < item.cost) {
      setMessage('Not enough points!');
      setTimeout(() => setMessage(''), 2000);
      return;
    }
    if (ownedItems.includes(item.id)) {
      setMessage('Already owned!');
      setTimeout(() => setMessage(''), 2000);
      return;
    }
    try {
      const res = await api.post('/room/buy', { itemId: item.id, cost: item.cost });
      setPoints(res.data.points);
      setOwnedItems(res.data.room.items);
      setMessage(`Bought ${item.name}!`);
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      setMessage('Purchase failed');
    }
  };

  return (
    <div style={{ fontFamily: "'Press Start 2P', monospace", background: '#1a1a2e', minHeight: '100vh', padding: '20px', color: 'white' }}>
      
      {/* Points display */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2 style={{ color: '#e94560', fontSize: '14px' }}>🏠 My Room</h2>
        <span style={{ color: '#ffd700', fontSize: '12px' }}>⭐ {points} pts</span>
      </div>

      {message && (
        <div style={{ background: '#e94560', padding: '8px', textAlign: 'center', marginBottom: '10px', fontSize: '10px' }}>
          {message}
        </div>
      )}

      {/* The Room */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '300px',
        background: 'linear-gradient(180deg, #16213e 60%, #8B6914 60%)',
        border: '4px solid #e94560',
        imageRendering: 'pixelated',
        marginBottom: '30px',
        overflow: 'hidden'
      }}>
        {/* Wall pattern */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: '60%',
          backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.03) 40px, rgba(255,255,255,0.03) 41px)',
        }} />
        
        {/* Floor pattern */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: '40%',
          backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(0,0,0,0.2) 50px, rgba(0,0,0,0.2) 51px)',
        }} />

        {/* Render owned items */}
        {ownedItems.map(itemId => {
          const pos = ITEM_POSITIONS[itemId];
          const item = SHOP_ITEMS.find(i => i.id === itemId);
          return (
            <div key={itemId} style={{
              position: 'absolute',
              ...pos,
              fontSize: '32px',
              filter: 'drop-shadow(2px 2px 0px rgba(0,0,0,0.8))',
              cursor: 'default',
              userSelect: 'none'
            }}>
              {item?.emoji}
            </div>
          );
        })}

        {/* Empty room message */}
        {ownedItems.length === 0 && (
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '8px', color: 'rgba(255,255,255,0.3)',
            textAlign: 'center', lineHeight: '2'
          }}>
            Your room is empty.<br/>Complete tasks to earn points!
          </div>
        )}
      </div>

      {/* Shop */}
      <h3 style={{ color: '#0f3460', background: '#e94560', padding: '8px', fontSize: '10px', marginBottom: '15px' }}>
        🛒 SHOP
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
        {SHOP_ITEMS.map(item => (
          <div key={item.id} style={{
            background: ownedItems.includes(item.id) ? '#0f3460' : '#16213e',
            border: `2px solid ${ownedItems.includes(item.id) ? '#ffd700' : '#e94560'}`,
            padding: '12px',
            textAlign: 'center',
            cursor: ownedItems.includes(item.id) ? 'default' : 'pointer',
            opacity: ownedItems.includes(item.id) ? 0.6 : 1
          }} onClick={() => buyItem(item)}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>{item.emoji}</div>
            <div style={{ fontSize: '7px', marginBottom: '6px', color: '#a8dadc' }}>{item.name}</div>
            <div style={{ fontSize: '8px', color: '#ffd700' }}>
              {ownedItems.includes(item.id) ? '✓ owned' : `⭐ ${item.cost}`}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}