import React, { useState, useEffect } from 'react';
import './Conscious.css';
import { db } from '../../firebase/firebase';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDocs,
  arrayUnion,
  arrayRemove,
  deleteDoc
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export function Conscious() {
  const [botCategories, setBotCategories] = useState([]);
  const [activeBotCategory, setActiveBotCategory] = useState('');
  const [showAddCategoryPopup, setShowAddCategoryPopup] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  const [showAddBotPopup, setShowAddBotPopup] = useState(false);
  const [newBotData, setNewBotData] = useState(['', '', '', '']);
  const [isAddingBot, setIsAddingBot] = useState(false);

  const [showEditCategoryPopup, setShowEditCategoryPopup] = useState(false);
  const [editCategoryData, setEditCategoryData] = useState({ id: '', name: '' });
  const [isSavingCategory, setIsSavingCategory] = useState(false);

  const [showEditBotPopup, setShowEditBotPopup] = useState(false);
  const [editBotData, setEditBotData] = useState({
    categoryId: '',
    original: null,
    updated: { botName: '', botDescription: '', token: '', base: '' }
  });
  const [isSavingBot, setIsSavingBot] = useState(false);

  const [confirmDelete, setConfirmDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [showDetailPopup, setShowDetailPopup] = useState(false);
  const [detailTitle, setDetailTitle] = useState('');
  const [detailContent, setDetailContent] = useState('');

  useEffect(() => {
    fetchBotCategories();
  }, []);

  const fetchBotCategories = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;
    try {
      const userBotsCollection = collection(db, `Users/${user.uid}/Bots`);
      const querySnapshot = await getDocs(userBotsCollection);
      const userBotCategories = [];
      querySnapshot.forEach((docItem) => {
        userBotCategories.push({
          id: docItem.id,
          name: docItem.data().name,
          bots: docItem.data().bots || []
        });
      });
      setBotCategories(userBotCategories);
    } catch (e) {
      console.error(e);
    }
  };

  const openAddCategoryPopup = () => {
    setNewCategoryName('');
    setShowAddCategoryPopup(true);
  };

  const closeAddCategoryPopup = () => {
    setShowAddCategoryPopup(false);
    setNewCategoryName('');
    setIsAddingCategory(false);
  };

  const handleAddCategory = async () => {
    if (isAddingCategory) return;
    setIsAddingCategory(true);
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      setIsAddingCategory(false);
      return;
    }
    if (!newCategoryName.trim()) {
      setIsAddingCategory(false);
      return;
    }
    try {
      const userBotsCollection = collection(db, `Users/${user.uid}/Bots`);
      const docRef = await addDoc(userBotsCollection, {
        name: newCategoryName.trim(),
        bots: []
      });
      const newCategory = { id: docRef.id, name: newCategoryName.trim(), bots: [] };
      setBotCategories((prev) => [...prev, newCategory]);
      setActiveBotCategory(docRef.id);
      closeAddCategoryPopup();
    } catch (e) {
      console.error(e);
      setIsAddingCategory(false);
    }
  };

  const openAddBotPopup = () => {
    if (!activeBotCategory) return;
    setNewBotData(['', '', '', '']);
    setShowAddBotPopup(true);
  };

  const closeAddBotPopup = () => {
    setShowAddBotPopup(false);
    setNewBotData(['', '', '', '']);
    setIsAddingBot(false);
  };

  const handleBotInputChange = (index, value) => {
    const updated = [...newBotData];
    updated[index] = value;
    setNewBotData(updated);
  };

  const addBotToCategory = async () => {
    if (isAddingBot) return;
    setIsAddingBot(true);
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user || !activeBotCategory) {
      setIsAddingBot(false);
      return;
    }
    try {
      const categoryDocRef = doc(db, `Users/${user.uid}/Bots`, activeBotCategory);
      await updateDoc(categoryDocRef, {
        bots: arrayUnion({
          botName: newBotData[0],
          botDescription: newBotData[1],
          token: newBotData[2],
          base: newBotData[3]
        })
      });
      setBotCategories((prev) =>
        prev.map((cat) =>
          cat.id === activeBotCategory
            ? {
                ...cat,
                bots: [
                  ...cat.bots,
                  {
                    botName: newBotData[0],
                    botDescription: newBotData[1],
                    token: newBotData[2],
                    base: newBotData[3]
                  }
                ]
              }
            : cat
        )
      );
      closeAddBotPopup();
    } catch (e) {
      console.error(e);
      setIsAddingBot(false);
    }
  };

  const handleEditCategoryClick = (cat) => {
    setEditCategoryData({ id: cat.id, name: cat.name });
    setShowEditCategoryPopup(true);
    setIsSavingCategory(false);
  };

  const handleSaveEditedCategory = async () => {
    if (isSavingCategory) return;
    setIsSavingCategory(true);
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;
    if (!editCategoryData.id || !editCategoryData.name.trim()) {
      setShowEditCategoryPopup(false);
      return;
    }
    try {
      const docRef = doc(db, `Users/${user.uid}/Bots`, editCategoryData.id);
      await updateDoc(docRef, {
        name: editCategoryData.name.trim()
      });
      setBotCategories((prev) =>
        prev.map((c) =>
          c.id === editCategoryData.id
            ? { ...c, name: editCategoryData.name.trim() }
            : c
        )
      );
      setShowEditCategoryPopup(false);
    } catch (e) {
      console.error(e);
      setIsSavingCategory(false);
    }
  };

  const handleDeleteCategoryClick = (cat) => {
    setConfirmDelete({
      type: 'category',
      data: cat
    });
  };

  const handleDeleteBotClick = (catId, bot) => {
    setConfirmDelete({
      type: 'bot',
      data: { catId, bot }
    });
  };

  const confirmDeleteAction = async () => {
    if (!confirmDelete) return;
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;
    try {
      if (confirmDelete.type === 'category') {
        const { id } = confirmDelete.data;
        const docRef = doc(db, `Users/${user.uid}/Bots`, id);
        await deleteDoc(docRef);
        setBotCategories((prev) => prev.filter((c) => c.id !== id));
        if (activeBotCategory === id) setActiveBotCategory('');
      } else if (confirmDelete.type === 'bot') {
        const { catId, bot } = confirmDelete.data;
        const docRef = doc(db, `Users/${user.uid}/Bots`, catId);
        await updateDoc(docRef, {
          bots: arrayRemove(bot)
        });
        setBotCategories((prev) =>
          prev.map((c) => {
            if (c.id !== catId) return c;
            return {
              ...c,
              bots: c.bots.filter(
                (b) =>
                  !(
                    b.botName === bot.botName &&
                    b.botDescription === bot.botDescription &&
                    b.token === bot.token &&
                    b.base === bot.base
                  )
              )
            };
          })
        );
      }
      setConfirmDelete(null);
    } catch (err) {
      console.error(err);
      setConfirmDelete(null);
    }
  };

  const cancelDeleteAction = () => {
    setConfirmDelete(null);
  };

  const handleEditBotClick = (categoryId, bot) => {
    setEditBotData({
      categoryId,
      original: { ...bot },
      updated: { ...bot }
    });
    setShowEditBotPopup(true);
    setIsSavingBot(false);
  };

  const handleEditBotFieldChange = (field, value) => {
    setEditBotData((prev) => ({
      ...prev,
      updated: { ...prev.updated, [field]: value }
    }));
  };

  const saveEditedBot = async () => {
    if (isSavingBot) return;
    setIsSavingBot(true);
    if (!editBotData.categoryId) return;
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;
    const { categoryId, original, updated } = editBotData;
    try {
      const docRef = doc(db, `Users/${user.uid}/Bots`, categoryId);
      await updateDoc(docRef, {
        bots: arrayRemove(original)
      });
      await updateDoc(docRef, {
        bots: arrayUnion(updated)
      });
      setBotCategories((prev) =>
        prev.map((cat) => {
          if (cat.id !== categoryId) return cat;
          return {
            ...cat,
            bots: cat.bots
              .filter(
                (b) =>
                  !(
                    b.botName === original.botName &&
                    b.botDescription === original.description &&
                    b.token === original.token &&
                    b.base === original.base
                  )
              )
              .concat(updated)
          };
        })
      );
      setShowEditBotPopup(false);
      setEditBotData({ categoryId: '', original: null, updated: {} });
    } catch (e) {
      console.error(e);
      setIsSavingBot(false);
    }
  };

  const filteredBots = botCategories.flatMap((cat) =>
    cat.bots
      .filter(
        (b) =>
          b.botName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          b.botDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
          b.token.toLowerCase().includes(searchTerm.toLowerCase()) ||
          b.base.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .map((b) => ({ ...b, catId: cat.id, catName: cat.name }))
  );

  const openDetailPopup = (title, content) => {
    setDetailTitle(title);
    setDetailContent(content);
    setShowDetailPopup(true);
  };

  const closeDetailPopup = () => {
    setDetailTitle('');
    setDetailContent('');
    setShowDetailPopup(false);
  };

  return (
    <div className="bot-creation">
      <div className="bot-creation-header">
        <h1>Сознание</h1>
        <p>Создайте свое исскуственное сознание</p>
      </div>
      <div className="bot-creation-content">
        <div className="bot-category-selection">
          <h1>Категории Ботов</h1>
          <div className="category-button-group">
            {botCategories.length === 0 && (
              <p style={{ textAlign: 'center', color: '#9e9e9e' }}>Нет категорий</p>
            )}
            {botCategories.map((category) => (
              <div
                key={category.id}
                style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}
              >
                <button
                  className={activeBotCategory === category.id ? 'active' : ''}
                  onClick={() => setActiveBotCategory(category.id)}
                  style={{ flex: 1 }}
                >
                  {category.name}
                </button>
                <span
                  style={{
                    cursor: 'pointer',
                    marginLeft: '5px',
                    color: 'gray',
                    fontSize: '1.3em'
                  }}
                  onClick={() => handleDeleteCategoryClick(category)}
                  title="Удалить категорию"
                >
                  -
                </span>
                <span
                  style={{
                    cursor: 'pointer',
                    marginLeft: '10px',
                    color: 'gray',
                    fontSize: '1.3em'
                  }}
                  onClick={() => handleEditCategoryClick(category)}
                  title="Редактировать категорию"
                >
                  ✎
                </span>
              </div>
            ))}
            <button className="category-add-btn" onClick={openAddCategoryPopup}>
              +
            </button>
          </div>
        </div>
        <div className="bot-table">
          <div className="search-bar bot-search">
            <img src="/icons/search.png" className="search-icon" alt="search" />
            <input
              type="text"
              className="search-input"
              placeholder="Поиск"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {searchTerm ? (
            <div className="search-results-box">
              {filteredBots.length > 0 ? (
                filteredBots.map((bot, index) => (
                  <p key={index} style={{ margin: '5px 0', color: '#333' }}>
                    {bot.catName} → {bot.botName} ({bot.token})
                  </p>
                ))
              ) : (
                <p style={{ color: '#555' }}>Ничего не найдено</p>
              )}
            </div>
          ) : (
            botCategories.map((category) =>
              activeBotCategory === category.id ? (
                <div key={category.id} className="category-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Название Сознания</th>
                        <th>Описание</th>
                        <th>Токен/Месенджер</th>
                        <th>База</th>
                        <th>Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {category.bots.map((bot, index) => {
                        const shortDesc =
                          bot.botDescription && bot.botDescription.length > 20
                            ? bot.botDescription.slice(0, 20) + '...'
                            : bot.botDescription || '—';
                        const shortBase =
                          bot.base && bot.base.length > 20
                            ? bot.base.slice(0, 20) + '...'
                            : bot.base || '—';
                        return (
                          <tr key={index}>
                            <td>{bot.botName || '—'}</td>
                            <td>
                              {shortDesc}{' '}
                              {bot.botDescription && bot.botDescription.length > 20 && (
                                <span
                                  className="show-details-icon"
                                  onClick={() =>
                                    openDetailPopup('Полное описание', bot.botDescription)
                                  }
                                >
                                  📝
                                </span>
                              )}
                            </td>
                            <td>{bot.token || '—'}</td>
                            <td>
                              {shortBase}{' '}
                              {bot.base && bot.base.length > 20 && (
                                <span
                                  className="show-details-icon"
                                  onClick={() => openDetailPopup('Полная база', bot.base)}
                                >
                                  📝
                                </span>
                              )}
                            </td>
                            <td>
                              <span
                                className="delete-bot-icon"
                                onClick={() => handleDeleteBotClick(category.id, bot)}
                                title="Удалить бота"
                              >
                                -
                              </span>
                              <span
                                className="edit-bot-icon"
                                onClick={() => handleEditBotClick(category.id, bot)}
                                title="Редактировать бота"
                              >
                                ✎
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {category.bots.length === 0 && (
                    <p style={{ textAlign: 'center', color: '#9e9e9e' }}>Нет ботов</p>
                  )}
                </div>
              ) : null
            )
          )}
          {activeBotCategory && !searchTerm && (
            <button className="create-bot-btn" onClick={openAddBotPopup}>
              Создать Бота
            </button>
          )}
        </div>
      </div>
      {showAddCategoryPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>Создать категорию</h2>
            <input
              type="text"
              placeholder="Название категории"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
            <div className="popup-buttons">
              <button onClick={handleAddCategory} disabled={isAddingCategory}>
                {isAddingCategory ? 'Добавляю...' : 'Добавить'}
              </button>
              <button onClick={closeAddCategoryPopup}>Отмена</button>
            </div>
          </div>
        </div>
      )}
      {showAddBotPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>Создать бота</h2>
            <div className="bot-input-group">
              <input
                type="text"
                placeholder="Название"
                value={newBotData[0]}
                onChange={(e) => handleBotInputChange(0, e.target.value)}
              />
              <textarea
                placeholder="Описание"
                value={newBotData[1]}
                onChange={(e) => handleBotInputChange(1, e.target.value)}
                style={{ minHeight: '60px', resize: 'vertical' }}
              />
              <input
                type="text"
                placeholder="Токен/Месенджер"
                value={newBotData[2]}
                onChange={(e) => handleBotInputChange(2, e.target.value)}
              />
              <textarea
                placeholder="База"
                value={newBotData[3]}
                onChange={(e) => handleBotInputChange(3, e.target.value)}
                style={{ minHeight: '60px', resize: 'vertical' }}
              />
            </div>
            <div className="popup-buttons">
              <button onClick={addBotToCategory} disabled={isAddingBot}>
                {isAddingBot ? 'Добавляю...' : 'Добавить'}
              </button>
              <button onClick={closeAddBotPopup}>Отмена</button>
            </div>
          </div>
        </div>
      )}
      {showEditCategoryPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>Редактировать категорию</h2>
            <input
              type="text"
              placeholder="Название категории"
              value={editCategoryData.name}
              onChange={(e) =>
                setEditCategoryData((prev) => ({ ...prev, name: e.target.value }))
              }
            />
            <div className="popup-buttons">
              <button onClick={handleSaveEditedCategory} disabled={isSavingCategory}>
                {isSavingCategory ? 'Сохраняю...' : 'Сохранить'}
              </button>
              <button onClick={() => setShowEditCategoryPopup(false)}>Отмена</button>
            </div>
          </div>
        </div>
      )}
      {showEditBotPopup && editBotData.original && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>Редактировать Бота</h2>
            <div className="bot-input-group">
              <input
                type="text"
                placeholder="Название"
                value={editBotData.updated.botName}
                onChange={(e) => handleEditBotFieldChange('botName', e.target.value)}
              />
              <textarea
                placeholder="Описание"
                value={editBotData.updated.botDescription}
                onChange={(e) => handleEditBotFieldChange('botDescription', e.target.value)}
                style={{ minHeight: '60px', resize: 'vertical' }}
              />
              <input
                type="text"
                placeholder="Токен/Месенджер"
                value={editBotData.updated.token}
                onChange={(e) => handleEditBotFieldChange('token', e.target.value)}
              />
              <textarea
                placeholder="База"
                value={editBotData.updated.base}
                onChange={(e) => handleEditBotFieldChange('base', e.target.value)}
                style={{ minHeight: '60px', resize: 'vertical' }}
              />
            </div>
            <div className="popup-buttons">
              <button onClick={saveEditedBot} disabled={isSavingBot}>
                {isSavingBot ? 'Сохраняю...' : 'Сохранить'}
              </button>
              <button
                onClick={() => {
                  setShowEditBotPopup(false);
                  setEditBotData({
                    categoryId: '',
                    original: null,
                    updated: { botName: '', botDescription: '', token: '', base: '' }
                  });
                }}
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
      {confirmDelete && (
        <div className="popup-overlay">
          <div className="popup-content">
            {confirmDelete.type === 'category' ? (
              <>
                <h2>Удалить категорию?</h2>
                <p>Вы действительно хотите удалить категорию «{confirmDelete.data.name}»?</p>
              </>
            ) : (
              <>
                <h2>Удалить бота?</h2>
                <p>Вы действительно хотите удалить бота «{confirmDelete.data.bot.botName}»?</p>
              </>
            )}
            <div className="popup-buttons">
              <button onClick={confirmDeleteAction}>Да</button>
              <button onClick={cancelDeleteAction}>Нет</button>
            </div>
          </div>
        </div>
      )}
      {showDetailPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>{detailTitle}</h2>
            <div className="bot-input-group">
              <textarea
                value={detailContent}
                readOnly
                style={{ minHeight: '150px', resize: 'vertical' }}
              />
            </div>
            <div className="popup-buttons">
              <button onClick={closeDetailPopup}>Закрыть</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
