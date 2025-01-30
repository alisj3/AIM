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
import { useTranslation } from "react-i18next";

export function Conscious() {
  
    const { t } = useTranslation();

  // Updated state to include parasiticWords and character
  const [botCategories, setBotCategories] = useState([]);
  const [activeBotCategory, setActiveBotCategory] = useState('');
  const [showAddCategoryPopup, setShowAddCategoryPopup] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  const [showAddBotPopup, setShowAddBotPopup] = useState(false);
  // Expanded newBotData to include parasiticWords and character
  const [newBotData, setNewBotData] = useState(['', '', '', '', '', '']); // [botName, botDescription, token, base, parasiticWords, character]
  const [isAddingBot, setIsAddingBot] = useState(false);

  const [showEditCategoryPopup, setShowEditCategoryPopup] = useState(false);
  const [editCategoryData, setEditCategoryData] = useState({ id: '', name: '' });
  const [isSavingCategory, setIsSavingCategory] = useState(false);

  const [showEditBotPopup, setShowEditBotPopup] = useState(false);
  // Expanded editBotData to include parasiticWords and character
  const [editBotData, setEditBotData] = useState({
    categoryId: '',
    original: null,
    updated: { botName: '', botDescription: '', token: '', base: '', parasiticWords: '', character: '' }
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
    setNewBotData(['', '', '', '', '', '']);
    setShowAddBotPopup(true);
  };

  const closeAddBotPopup = () => {
    setShowAddBotPopup(false);
    setNewBotData(['', '', '', '', '', '']);
    setIsAddingBot(false);
  };

  // Updated to handle all fields including parasiticWords and character
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
    // Validate required fields (e.g., botName)
    if (!newBotData[0].trim()) {
      alert(t('botNameRequired')); // Ensure you have this translation key
      setIsAddingBot(false);
      return;
    }
    try {
      const categoryDocRef = doc(db, `Users/${user.uid}/Bots`, activeBotCategory);
      await updateDoc(categoryDocRef, {
        bots: arrayUnion({
          botName: newBotData[0].trim(),
          botDescription: newBotData[1].trim(),
          token: newBotData[2].trim(),
          base: newBotData[3].trim(),
          parasiticWords: newBotData[4].trim(),
          character: newBotData[5] // Assuming character is selected from predefined options
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
                    botName: newBotData[0].trim(),
                    botDescription: newBotData[1].trim(),
                    token: newBotData[2].trim(),
                    base: newBotData[3].trim(),
                    parasiticWords: newBotData[4].trim(),
                    character: newBotData[5]
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
    if (!user) {
      setIsSavingCategory(false);
      return;
    }
    if (!editCategoryData.id || !editCategoryData.name.trim()) {
      setShowEditCategoryPopup(false);
      setIsSavingCategory(false);
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
                    b.base === bot.base &&
                    b.parasiticWords === bot.parasiticWords &&
                    b.character === bot.character
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
    if (!user) {
      setIsSavingBot(false);
      return;
    }
    const { categoryId, original, updated } = editBotData;
    // Validate required fields (e.g., botName)
    if (!updated.botName.trim()) {
      alert(t('botNameRequired')); // Ensure you have this translation key
      setIsSavingBot(false);
      return;
    }
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
                    b.botDescription === original.botDescription &&
                    b.token === original.token &&
                    b.base === original.base &&
                    b.parasiticWords === original.parasiticWords &&
                    b.character === original.character
                  )
              )
              .concat(updated)
          };
        })
      );
      setShowEditBotPopup(false);
      setEditBotData({ categoryId: '', original: null, updated: { botName: '', botDescription: '', token: '', base: '', parasiticWords: '', character: '' } });
    } catch (e) {
      console.error(e);
      setIsSavingBot(false);
    }
  };

  // Updated search to include parasiticWords and character
  const filteredBots = botCategories.flatMap((cat) =>
    cat.bots
      .filter(
        (b) =>
          b.botName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          b.botDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
          b.token.toLowerCase().includes(searchTerm.toLowerCase()) ||
          b.base.toLowerCase().includes(searchTerm.toLowerCase()) ||
          b.parasiticWords.toLowerCase().includes(searchTerm.toLowerCase()) || // New Field
          b.character.toLowerCase().includes(searchTerm.toLowerCase())        // New Field
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
      <h1>{t('consciousnessTitle')}</h1>
      <p>{t('consciousnessDescription')}</p>
      <div className="bot-creation-content">
        <div className="bot-category-selection">
          <h1>{t('botCategoryTitle')}</h1>
          <div className="category-button-group">
            {botCategories.length === 0 && (
              <p style={{ textAlign: 'center', color: '#9e9e9e' }}>{t('noCategories')}</p>
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
                  title={t('deletingConfirmationCategory')}
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
                  title={t('editCategoryTitle')}
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
              placeholder={t('searchPlaceholder')}
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
                <p style={{ color: '#555' }}>{t('noResultsFound')}</p>
              )}
            </div>
          ) : (
            botCategories.map((category) =>
              activeBotCategory === category.id ? (
                <div key={category.id} className="category-table">
                  <table>
                    <thead>
                      <tr>
                        <th>{t('botNamePlaceholder')}</th>
                        <th>{t('botDescriptionPlaceholder')}</th>
                        <th>{t('tokenPlaceholder')}</th>
                        <th>{t('basePlaceholder')}</th>
                        <th>{t('parasiticWordsTitle')}</th> {/* New Header */}
                        <th>{t('characterTitle')}</th>         {/* New Header */}
                        <th>{t('actions')}</th>
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
                        const shortParasiticWords =
                          bot.parasiticWords && bot.parasiticWords.length > 20
                            ? bot.parasiticWords.slice(0, 20) + '...'
                            : bot.parasiticWords || '—';
                        const shortCharacter =
                          bot.character && bot.character.length > 20
                            ? bot.character.slice(0, 20) + '...'
                            : bot.character || '—';
                        return (
                          <tr key={index}>
                            <td>{bot.botName || '—'}</td>
                            <td>
                              {shortDesc}{' '}
                              {bot.botDescription && bot.botDescription.length > 20 && (
                                <span
                                  className="show-details-icon"
                                  onClick={() =>
                                    openDetailPopup(t('fullDescription'), bot.botDescription)
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
                                  onClick={() => openDetailPopup(t('fullBase'), bot.base)}
                                >
                                  📝
                                </span>
                              )}
                            </td>
                            <td>
                              {shortParasiticWords}{' '}
                              {bot.parasiticWords && bot.parasiticWords.length > 20 && (
                                <span
                                  className="show-details-icon"
                                  onClick={() =>
                                    openDetailPopup(t('fullParasiticWords'), bot.parasiticWords)
                                  }
                                >
                                  📝
                                </span>
                              )}
                            </td>
                            <td>
                              {shortCharacter}{' '}
                              {bot.character && bot.character.length > 20 && (
                                <span
                                  className="show-details-icon"
                                  onClick={() =>
                                    openDetailPopup(t('fullCharacter'), bot.character)
                                  }
                                >
                                  📝
                                </span>
                              )}
                            </td>
                            <td>
                              <span
                                className="delete-bot-icon"
                                onClick={() => handleDeleteBotClick(category.id, bot)}
                                title={t('deletingConfirmationBot')}
                              >
                                -
                              </span>
                              <span
                                className="edit-bot-icon"
                                onClick={() => handleEditBotClick(category.id, bot)}
                                title={t('editBotTitle')}
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
                    <p style={{ textAlign: 'center', color: '#9e9e9e' }}>{t('noBots')}</p>
                  )}
                </div>
              ) : null
            )
          )}
          {activeBotCategory && !searchTerm && (
            <button className="create-bot-btn" onClick={openAddBotPopup}>
              {t('createBotButton')}
            </button>
          )}
        </div>
      </div>
      {/* Add Category Popup */}
      {showAddCategoryPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>{t('addCategoryPopupTitle')}</h2>
            <input
              type="text"
              placeholder={t('addCategoryPlaceholder')}
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
            <div className="popup-buttons">
              <button onClick={handleAddCategory} disabled={isAddingCategory}>
                {isAddingCategory ? t('addingText') : t('addButtonText')}
              </button>
              <button onClick={closeAddCategoryPopup}>{t('cancelButtonText')}</button>
            </div>
          </div>
        </div>
      )}
      {/* Add Bot Popup */}
      {showAddBotPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>{t('addBotPopupTitle')}</h2>
            <div className="bot-input-group">
              <input
                type="text"
                placeholder={t('botNamePlaceholder')}
                value={newBotData[0]}
                onChange={(e) => handleBotInputChange(0, e.target.value)}
              />
              <textarea
                placeholder={t('botDescriptionPlaceholder')}
                value={newBotData[1]}
                onChange={(e) => handleBotInputChange(1, e.target.value)}
                style={{ minHeight: '60px', resize: 'vertical' }}
              />
              <input
                type="text"
                placeholder={t('tokenPlaceholder')}
                value={newBotData[2]}
                onChange={(e) => handleBotInputChange(2, e.target.value)}
              />
              <textarea
                placeholder={t('basePlaceholder')}
                value={newBotData[3]}
                onChange={(e) => handleBotInputChange(3, e.target.value)}
                style={{ minHeight: '60px', resize: 'vertical' }}
              />
              {/* New Fields */}
              <input
                type="text"
                placeholder={t('parasiticWordsPlaceholder')}
                value={newBotData[4]}
                onChange={(e) => handleBotInputChange(4, e.target.value)}
              />
              <select
                value={newBotData[5]}
                onChange={(e) => handleBotInputChange(5, e.target.value)}
              >
                <option value="">{t('selectCharacterPlaceholder')}</option>
                <option value="Good">{t('characterGood')}</option>
                <option value="Evil">{t('characterEvil')}</option>
                <option value="Passive">{t('characterPassive')}</option>
                <option value="Active">{t('characterActive')}</option>
              </select>
            </div>
            <div className="popup-buttons">
              <button onClick={addBotToCategory} disabled={isAddingBot}>
                {isAddingBot ? t('addingText') : t('addButtonText')}
              </button>
              <button onClick={closeAddBotPopup}>{t('cancelButtonText')}</button>
            </div>
          </div>
        </div>
      )}
      {/* Edit Category Popup */}
      {showEditCategoryPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>{t('editCategoryTitle')}</h2>
            <input
              type="text"
              placeholder={t('addCategoryPlaceholder')}
              value={editCategoryData.name}
              onChange={(e) =>
                setEditCategoryData((prev) => ({ ...prev, name: e.target.value }))
              }
            />
            <div className="popup-buttons">
              <button onClick={handleSaveEditedCategory} disabled={isSavingCategory}>
                {isSavingCategory ? t('savingText') : t('saveButtonText')}
              </button>
              <button onClick={() => setShowEditCategoryPopup(false)}>{t('cancelButtonText')}</button>
            </div>
          </div>
        </div>
      )}
      {/* Edit Bot Popup */}
      {showEditBotPopup && editBotData.original && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>{t('editBotTitle')}</h2>
            <div className="bot-input-group">
              <input
                type="text"
                placeholder={t('botNamePlaceholder')}
                value={editBotData.updated.botName}
                onChange={(e) => handleEditBotFieldChange('botName', e.target.value)}
              />
              <textarea
                placeholder={t('botDescriptionPlaceholder')}
                value={editBotData.updated.botDescription}
                onChange={(e) => handleEditBotFieldChange('botDescription', e.target.value)}
                style={{ minHeight: '60px', resize: 'vertical' }}
              />
              <input
                type="text"
                placeholder={t('tokenPlaceholder')}
                value={editBotData.updated.token}
                onChange={(e) => handleEditBotFieldChange('token', e.target.value)}
              />
              <textarea
                placeholder={t('basePlaceholder')}
                value={editBotData.updated.base}
                onChange={(e) => handleEditBotFieldChange('base', e.target.value)}
                style={{ minHeight: '60px', resize: 'vertical' }}
              />
              {/* New Fields */}
              <input
                type="text"
                placeholder={t('parasiticWordsPlaceholder')}
                value={editBotData.updated.parasiticWords}
                onChange={(e) => handleEditBotFieldChange('parasiticWords', e.target.value)}
              />
              <select
                value={editBotData.updated.character}
                onChange={(e) => handleEditBotFieldChange('character', e.target.value)}
              >
                <option value="">{t('selectCharacterPlaceholder')}</option>
                <option value="Good">{t('characterGood')}</option>
                <option value="Evil">{t('characterEvil')}</option>
                <option value="Passive">{t('characterPassive')}</option>
                <option value="Active">{t('characterActive')}</option>
              </select>
            </div>
            <div className="popup-buttons">
              <button onClick={saveEditedBot} disabled={isSavingBot}>
                {isSavingBot ? t('savingText') : t('saveButtonText')}
              </button>
              <button
                onClick={() => {
                  setShowEditBotPopup(false);
                  setEditBotData({
                    categoryId: '',
                    original: null,
                    updated: { botName: '', botDescription: '', token: '', base: '', parasiticWords: '', character: '' }
                  });
                }}
              >
                {t('cancelButtonText')}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Confirm Delete Popup */}
      {confirmDelete && (
        <div className="popup-overlay">
          <div className="popup-content">
            {confirmDelete.type === 'category' ? (
              <>
                <h2>{t('deletingConfirmationCategory')}</h2>
                <p>{t('deleteConfirmationTextCategory').replace('{{categoryName}}', confirmDelete.data.name)}</p>
              </>
            ) : (
              <>
                <h2>{t('deletingConfirmationBot')}</h2>
                <p>{t('deleteConfirmationTextBot').replace('{{botName}}', confirmDelete.data.bot.botName)}</p>
              </>
            )}
            <div className="popup-buttons">
              <button onClick={confirmDeleteAction}>{t('yesButtonText')}</button>
              <button onClick={cancelDeleteAction}>{t('noButtonText')}</button>
            </div>
          </div>
        </div>
      )}
      {/* Detail Popup */}
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
              <button onClick={closeDetailPopup}>{t('closeButtonText')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
    {showAddCategoryPopup && (
      <div className="popup-overlay">
        <div className="popup-content">
          <h2>{t('addCategoryPopupTitle')}</h2>
          <input
            type="text"
            placeholder={t('addCategoryPlaceholder')}
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
          <div className="popup-buttons">
            <button onClick={handleAddCategory} disabled={isAddingCategory}>
              {isAddingCategory ? t('addingText') : t('addButtonText')}
            </button>
            <button onClick={closeAddCategoryPopup}>{t('cancelButtonText')}</button>
          </div>
        </div>
      </div>
    )}
    {showAddBotPopup && (
      <div className="popup-overlay">
        <div className="popup-content">
          <h2>{t('addBotPopupTitle')}</h2>
          <div className="bot-input-group">
            <input
              type="text"
              placeholder={t('botNamePlaceholder')}
              value={newBotData[0]}
              onChange={(e) => handleBotInputChange(0, e.target.value)}
            />
            <textarea
              placeholder={t('botDescriptionPlaceholder')}
              value={newBotData[1]}
              onChange={(e) => handleBotInputChange(1, e.target.value)}
              style={{ minHeight: '60px', resize: 'vertical' }}
            />
            <input
              type="text"
              placeholder={t('tokenPlaceholder')}
              value={newBotData[2]}
              onChange={(e) => handleBotInputChange(2, e.target.value)}
            />
            <textarea
              placeholder={t('basePlaceholder')}
              value={newBotData[3]}
              onChange={(e) => handleBotInputChange(3, e.target.value)}
              style={{ minHeight: '60px', resize: 'vertical' }}
            />
          </div>
          <div className="popup-buttons">
            <button onClick={addBotToCategory} disabled={isAddingBot}>
              {isAddingBot ? t('addingText') : t('addButtonText')}
            </button>
            <button onClick={closeAddBotPopup}>{t('cancelButtonText')}</button>
          </div>
        </div>
      </div>
    )}
    {showEditCategoryPopup && (
      <div className="popup-overlay">
        <div className="popup-content">
          <h2>{t('editCategoryTitle')}</h2>
          <input
            type="text"
            placeholder={t('addCategoryPlaceholder')}
            value={editCategoryData.name}
            onChange={(e) =>
              setEditCategoryData((prev) => ({ ...prev, name: e.target.value }))
            }
          />
          <div className="popup-buttons">
            <button onClick={handleSaveEditedCategory} disabled={isSavingCategory}>
              {isSavingCategory ? t('addingText') : t('saveButtonText')}
            </button>
            <button onClick={() => setShowEditCategoryPopup(false)}>{t('cancelButtonText')}</button>
          </div>
        </div>
      </div>
    )}
    {showEditBotPopup && editBotData.original && (
      <div className="popup-overlay">
        <div className="popup-content">
          <h2>{t('editBotTitle')}</h2>
          <div className="bot-input-group">
            <input
              type="text"
              placeholder={t('botNamePlaceholder')}
              value={editBotData.updated.botName}
              onChange={(e) => handleEditBotFieldChange('botName', e.target.value)}
            />
            <textarea
              placeholder={t('botDescriptionPlaceholder')}
              value={editBotData.updated.botDescription}
              onChange={(e) => handleEditBotFieldChange('botDescription', e.target.value)}
              style={{ minHeight: '60px', resize: 'vertical' }}
            />
            <input
              type="text"
              placeholder={t('tokenPlaceholder')}
              value={editBotData.updated.token}
              onChange={(e) => handleEditBotFieldChange('token', e.target.value)}
            />
            <textarea
              placeholder={t('basePlaceholder')}
              value={editBotData.updated.base}
              onChange={(e) => handleEditBotFieldChange('base', e.target.value)}
              style={{ minHeight: '60px', resize: 'vertical' }}
            />
          </div>
          <div className="popup-buttons">
            <button onClick={saveEditedBot} disabled={isSavingBot}>
              {isSavingBot ? t('addingText') : t('saveButtonText')}
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
              {t('cancelButtonText')}
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
              <h2>{t('deletingConfirmationCategory')}</h2>
              <p>{t('deleteConfirmationTextCategory').replace('{{categoryName}}', confirmDelete.data.name)}</p>
            </>
          ) : (
            <>
              <h2>{t('deletingConfirmationBot')}</h2>
              <p>{t('deleteConfirmationTextBot').replace('{{botName}}', confirmDelete.data.bot.botName)}</p>
            </>
          )}
          <div className="popup-buttons">
            <button onClick={confirmDeleteAction}>{t('yesButtonText')}</button>
            <button onClick={cancelDeleteAction}>{t('noButtonText')}</button>
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
            <button onClick={closeDetailPopup}>{t('closeButtonText')}</button>
          </div>
        </div>
      </div>
    )}
  </div>

  );
}
