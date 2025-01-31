// src/components/Neirostorage.jsx

import './Neirostorage.css'
import React, { useState, useEffect, useRef } from 'react'
import { db } from '../../firebase/firebase'
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDocs,
  arrayUnion,
  arrayRemove,
  deleteDoc
} from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { useTranslation } from 'react-i18next'

export function Services() {
  const { t } = useTranslation()
  const [categories, setCategories] = useState([])
  const [activeTable, setActiveTable] = useState('')
  const [newRow, setNewRow] = useState(['', '', '', '', ''])
  const [showAddCategoryPopup, setShowAddCategoryPopup] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [showAddProductPopup, setShowAddProductPopup] = useState(false)
  const [isAddingProduct, setIsAddingProduct] = useState(false)
  const [showEditCategoryPopup, setShowEditCategoryPopup] = useState(false)
  const [editCategoryData, setEditCategoryData] = useState({ id: '', name: '' })
  const [showEditProductPopup, setShowEditProductPopup] = useState(false)
  const [editProductData, setEditProductData] = useState(null)
  const [showUploadPopup, setShowUploadPopup] = useState(false)
  const [uploadFile, setUploadFile] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [highlightCategory, setHighlightCategory] = useState('')
  const [highlightRowIndex, setHighlightRowIndex] = useState(null)
  const tableRefs = useRef({})

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    if (highlightCategory && highlightRowIndex !== null) {
      setTimeout(() => {
        if (tableRefs.current[highlightCategory]?.[highlightRowIndex]) {
          tableRefs.current[highlightCategory][highlightRowIndex].scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          })
        }
      }, 100)
    }
  }, [highlightCategory, highlightRowIndex])

  const fetchCategories = async () => {
    const auth = getAuth()
    const user = auth.currentUser
    if (!user) return
    try {
      const userProductsCollection = collection(db, `Users/${user.uid}/Services`)
      const querySnapshot = await getDocs(userProductsCollection)
      const userCategories = []
      querySnapshot.forEach((docItem) => {
        userCategories.push({
          id: docItem.id,
          name: docItem.data().name,
          products: docItem.data().products || []
        })
      })
      setCategories(userCategories)
    } catch (e) {
      console.error(e)
    }
  }

  const handleTableChange = (tableId) => {
    setActiveTable(tableId)
    setHighlightCategory('')
    setHighlightRowIndex(null)
  }

  const handleOpenAddCategoryPopup = () => {
    setShowAddCategoryPopup(true)
  }

  const handleCloseAddCategoryPopup = () => {
    setShowAddCategoryPopup(false)
    setNewCategoryName('')
    setIsAddingCategory(false)
  }

  const handleAddCategory = async () => {
    if (isAddingCategory) return
    setIsAddingCategory(true)
    const auth = getAuth()
    const user = auth.currentUser
    if (!user) {
      setIsAddingCategory(false)
      return
    }
    if (!newCategoryName.trim()) {
      setIsAddingCategory(false)
      return
    }
    try {
      const userProductsCollection = collection(db, `Users/${user.uid}/Services`)
      const docRef = await addDoc(userProductsCollection, {
        name: newCategoryName.trim(),
        products: []
      })
      const newCategory = { id: docRef.id, name: newCategoryName.trim(), products: [] }
      setCategories((prev) => [...prev, newCategory])
      setActiveTable(docRef.id)
      handleCloseAddCategoryPopup()
    } catch (e) {
      console.error(e)
      setIsAddingCategory(false)
    }
  }

  const handleOpenAddProductPopup = () => {
    setShowAddProductPopup(true)
  }

  const handleCloseAddProductPopup = () => {
    setShowAddProductPopup(false)
    setNewRow(['', '', '', '', ''])
    setIsAddingProduct(false)
  }

  const handleInputChange = (index, value) => {
    const updated = [...newRow]
    updated[index] = value
    setNewRow(updated)
  }

  const addRowToTable = async () => {
    if (isAddingProduct) return
    setIsAddingProduct(true)
    const auth = getAuth()
    const user = auth.currentUser
    if (!user || !activeTable) {
      setIsAddingProduct(false)
      return
    }
    const [name, description, price, soldUnits, unit] = newRow
    if (!name.trim()) {
      setIsAddingProduct(false)
      return
    }

    const soldUnitsNum = Number(soldUnits);
    const unitNum = Number(unit);
    const left = unitNum - soldUnitsNum;

    try {
      const tableDocRef = doc(db, `Users/${user.uid}/Services`, activeTable)
      await updateDoc(tableDocRef, {
        products: arrayUnion({
          name: name.trim(),
          description: description.trim(),
          price: price.trim(),
          soldUnits: soldUnits,
          unit: unit,
          left: left
        })
      })
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === activeTable
            ? {
                ...cat,
                products: [
                  ...cat.products,
                  {
                    name: name.trim(),
                    description: description.trim(),
                    price: price.trim(),
                    soldUnits: soldUnits,
                    unit: unit,
                    left: left
                  }
                ]
              }
            : cat
        )
      )
      handleCloseAddProductPopup()
    } catch (e) {
      console.error(e)
      setIsAddingProduct(false)
    }
  }

  const handleOpenUploadPopup = () => {
    setShowUploadPopup(true)
  }

  const handleCloseUploadPopup = () => {
    setShowUploadPopup(false)
    setUploadFile(null)
    setDragActive(false)
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadFile(e.target.files[0])
    }
  }

  const handleDragEnter = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(true)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadFile(e.dataTransfer.files[0])
    }
  }

  const handleFileUpload = () => {
    if (!uploadFile) return
    console.log('Загружаем файл:', uploadFile.name)
    handleCloseUploadPopup()
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
    setHighlightCategory('')
    setHighlightRowIndex(null)
  }

  const filteredResults = categories.flatMap((cat) =>
    cat.products
      .filter((prod) => prod.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .map((prod) => ({
        catId: cat.id,
        categoryName: cat.name,
        productName: prod.name,
        productIndex: cat.products.indexOf(prod),
        productLeft: prod.left,
      }))
  )

  const handleSearchResultClick = (catId, rowIndex) => {
    setActiveTable(catId)
    setHighlightCategory(catId)
    setHighlightRowIndex(rowIndex)
    setSearchTerm('')
  }

  const handleDeleteCategoryClick = (categoryId) => {
    const category = categories.find((c) => c.id === categoryId)
    setConfirmDelete({
      type: 'category',
      data: { id: categoryId, name: category?.name || 'Сервисы' }
    })
  }

  const handleDeleteProductClick = (categoryId, product) => {
    setConfirmDelete({
      type: 'product',
      data: { categoryId, product }
    })
  }

  const confirmDeleteAction = async () => {
    if (!confirmDelete) return
    const auth = getAuth()
    const user = auth.currentUser
    if (!user) return
    try {
      if (confirmDelete.type === 'category') {
        const { id } = confirmDelete.data
        const docRef = doc(db, `Users/${user.uid}/Services`, id)
        await deleteDoc(docRef)
        setCategories((prev) => prev.filter((cat) => cat.id !== id))
        if (activeTable === id) setActiveTable('')
      } else if (confirmDelete.type === 'product') {
        const { categoryId, product } = confirmDelete.data
        const tableDocRef = doc(db, `Users/${user.uid}/Services`, categoryId)
        await updateDoc(tableDocRef, {
          products: arrayRemove(product)
        })
        setCategories((prev) =>
          prev.map((cat) => {
            if (cat.id === categoryId) {
              return {
                ...cat,
                products: cat.products.filter(
                  (p) =>
                    !(
                      p.name === product.name &&
                      p.description === product.description &&
                      p.price === product.price &&
                      p.soldUnits === product.soldUnits &&
                      p.unit === product.unit && 
                      p.left === product.left
                    )
                )
              }
            }
            return cat
          })
        )
      }
      setConfirmDelete(null)
    } catch (e) {
      console.error(e)
      setConfirmDelete(null)
    }
  }

  const cancelDeleteAction = () => {
    setConfirmDelete(null)
  }

  const handleEditProductClick = (categoryId, product) => {
    setEditProductData({
      categoryId,
      original: { ...product },
      updated: { ...product }
    })
    setShowEditProductPopup(true)
  }

  const handleEditProductFieldChange = (field, value) => {
    if (!editProductData) return
    setEditProductData((prev) => {
      const updatedProduct = {
        ...prev.updated,
        [field]: value,
      };
      
      if (field === "soldUnits" || field === "unit") {
        updatedProduct.left = updatedProduct.unit - updatedProduct.soldUnits;
      }
  
      return {
        ...prev,
        updated: updatedProduct,
      };
    });
  }

  const saveEditedProduct = async () => {
    if (!editProductData) return
    const auth = getAuth()
    const user = auth.currentUser
    if (!user) return
    const { categoryId, original, updated } = editProductData
    try {
      const tableDocRef = doc(db, `Users/${user.uid}/Services`, categoryId)
      await updateDoc(tableDocRef, {
        products: arrayRemove(original)
      })
      await updateDoc(tableDocRef, {
        products: arrayUnion(updated)
      })
      setCategories((prev) =>
        prev.map((cat) => {
          if (cat.id !== categoryId) return cat
          return {
            ...cat,
            products: cat.products
              .filter(
                (p) =>
                  !(
                    p.name === original.name &&
                    p.description === original.description &&
                    p.price === original.price &&
                    p.soldUnits === original.soldUnits &&
                    p.unit === original.unit &&
                    p.left === original.left
                  )
              )
              .concat(updated)
          }
        })
      )
      setShowEditProductPopup(false)
      setEditProductData(null)
    } catch (e) {
      console.error(e)
    }
  }

  const handleEditCategoryClick = (cat) => {
    setEditCategoryData({ id: cat.id, name: cat.name })
    setShowEditCategoryPopup(true)
  }

  const handleSaveEditedCategory = async () => {
    const auth = getAuth()
    const user = auth.currentUser
    if (!user) return
    if (!editCategoryData.id || !editCategoryData.name.trim()) {
      setShowEditCategoryPopup(false)
      return
    }
    try {
      const docRef = doc(db, `Users/${user.uid}/Services`, editCategoryData.id)
      await updateDoc(docRef, {
        name: editCategoryData.name.trim()
      })
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === editCategoryData.id
            ? { ...cat, name: editCategoryData.name.trim() }
            : cat
        )
      )
      setShowEditCategoryPopup(false)
    } catch (e) {
      console.error(e)
    }
  }

  const renderCategories = () => {
    if (categories.length === 0) {
      return <p style={{ textAlign: 'center', color: '#9e9e9e' }}>Нет сервисов</p>
    }
    return categories.map((category) => (
      <div className="category-item" key={category.id}>
        <button
          className={`category-button ${activeTable === category.id ? 'active' : ''}`}
          onClick={() => handleTableChange(category.id)}
        >
          {category.name}
        </button>
        <span
          style={{ color: 'gray', cursor: 'pointer', fontSize: '1.3em', marginLeft: '5px' }}
          onClick={() => handleDeleteCategoryClick(category.id)}
          title="Удалить сервис"
        >
          -
        </span>
        <span
          style={{ color: 'gray', cursor: 'pointer', fontSize: '1.3em', marginLeft: '5px' }}
          onClick={() => handleEditCategoryClick(category)}
          title="Редактировать сервис"
        >
          ✎
        </span>
      </div>
    ))
  }

  return (
    <div className="neirostorage">
      <div className="neirostorage-title">
        <h1>{t('MainNeurostorage')}</h1>
        <p>{t('NeurostorageSubtitle')}</p>
      </div>
      <div className="neirostorage-container">
        <div className="table-title">
          <h1>{t('NeurostorageServices')}</h1>
          <div className="button-group">
            {renderCategories()}
            <button className="add-category-button" onClick={handleOpenAddCategoryPopup}>
              +
            </button>
          </div>
        </div>
        <div className="dynamic-table">
          <div className="search-bar neiro-search">
            <img src="/icons/search.png" className="search-icon" alt="search" />
            <input
              type="text"
              className="search-input"
              placeholder="Поиск"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          {searchTerm ? (
            <div className="search-results-box">
              {filteredResults.length > 0 ? (
                filteredResults.map((item, index) => (
                  <p
                    key={index}
                    style={{ margin: '5px 0', color: '#333', cursor: 'pointer' }}
                    onClick={() => handleSearchResultClick(item.catId, item.productIndex)}
                  >
                    {item.categoryName}: {item.productName} - {item.productLeft > 0 ? (<span>Остаток: {item.productLeft}</span>) : (<span>Нет остатков продукта</span>)}
                  </p>
                ))
              ) : (
                <p style={{ color: '#555' }}>Ничего не найдено</p>
              )}
            </div>
          ) : (
            <>
              {categories.map((category) =>
                activeTable === category.id ? (
                  <div className="table" key={category.id}>
                    <table>
                      <thead>
                        <tr>
                          <th>Название</th>
                          <th>Описание</th>
                          <th>Цена</th>
                          <th>Продано</th>
                          <th>Единица</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {category.products && category.products.length > 0 ? (
                          category.products.map((product, rowIndex) => {
                            if (!tableRefs.current[category.id]) {
                              tableRefs.current[category.id] = []
                            }
                            return (
                              <tr
                                key={rowIndex}
                                ref={(el) => (tableRefs.current[category.id][rowIndex] = el)}
                              >
                                <td>{product.name}</td>
                                <td>{product.description}</td>
                                <td>{product.price}</td>
                                <td>{product.soldUnits}</td>
                                <td>{product.unit || '-'}</td>
                                <td>
                                  <span
                                    style={{
                                      color: 'gray',
                                      cursor: 'pointer',
                                      fontSize: '1.3em',
                                      marginRight: '10px'
                                    }}
                                    onClick={() => handleDeleteProductClick(category.id, product)}
                                    title="Удалить товар"
                                  >
                                    -
                                  </span>
                                  <span
                                    style={{
                                      color: 'gray',
                                      cursor: 'pointer',
                                      fontSize: '1.2em'
                                    }}
                                    onClick={() => handleEditProductClick(category.id, product)}
                                    title="Редактировать товар"
                                  >
                                    ✎
                                  </span>
                                </td>
                              </tr>
                            )
                          })
                        ) : (
                          <tr>
                            <td colSpan="6" style={{ textAlign: 'center', color: '#555' }}>
                              Нет товаров
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                    <div className="buttons-bottom-right">
                      <button className="create-product" onClick={handleOpenAddProductPopup}>
                        {t('ProductCreate')}
                      </button> 
                      <button className="create-product" onClick={handleOpenUploadPopup}>
                        Загрузить
                      </button>
                    </div>
                  </div>
                ) : null
              )}
            </>
          )}
        </div>
      </div>
      {showAddCategoryPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>Новый Сервис</h2>
            <input
              type="text"
              placeholder="Введите название сервиса"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
            <div className="popup-buttons">
              <button onClick={handleAddCategory} disabled={isAddingCategory}>
                {isAddingCategory ? 'Создаём...' : 'Создать'}
              </button>
              <button onClick={handleCloseAddCategoryPopup}>Отмена</button>
            </div>
          </div>
        </div>
      )}
      {showAddProductPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>Добавить товар</h2>
            <div className="input-group">
              <input
                type="text"
                placeholder="Название"
                value={newRow[0]}
                onChange={(e) => handleInputChange(0, e.target.value)}
              />
              <input
                type="text"
                placeholder="Описание"
                value={newRow[1]}
                onChange={(e) => handleInputChange(1, e.target.value)}
              />
              <input
                type="text"
                placeholder="Цена"
                value={newRow[2]}
                onChange={(e) => handleInputChange(2, e.target.value)}
              />
              <input
                type="text"
                placeholder="Продано"
                value={newRow[3]}
                onChange={(e) => handleInputChange(3, e.target.value)}
                style={{
                  padding: '10px',
                  border: '1px solid #555',
                  borderRadius: '4px',
                  backgroundColor: '#444',
                  color: '#fff'
                }}
              />
              <input
                type="text"
                placeholder="Единица товара"
                value={newRow[4]}
                onChange={(e) => handleInputChange(4, e.target.value)}
              />
            </div>
            <div className="popup-buttons">
              <button onClick={addRowToTable} disabled={isAddingProduct}>
                {isAddingProduct ? 'Добавляем...' : 'Добавить'}
              </button>
              <button onClick={handleCloseAddProductPopup}>Отмена</button>
            </div>
          </div>
        </div>
      )}
      {showUploadPopup && (
        <div className="popup-overlay">
          <div
            className={`popup-content upload-popup ${dragActive ? 'drag-active' : ''}`}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <h2>Загрузка файла</h2>
            <div
              className="upload-area"
              onClick={() => document.getElementById('hiddenFileInput').click()}
            >
              <img src="/icons/upload.png" alt="upload icon" className="upload-icon" />
              {dragActive ? (
                <p style={{ color: '#fff' }}>Отпустите файл, чтобы загрузить</p>
              ) : (
                <p>Перетащите файл или нажмите для выбора</p>
              )}
              <input
                type="file"
                id="hiddenFileInput"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </div>
            {uploadFile && <p style={{ marginTop: '10px' }}>{uploadFile.name}</p>}
            <div className="popup-buttons">
              <button onClick={handleFileUpload} disabled={!uploadFile}>
                Загрузить
              </button>
              <button onClick={handleCloseUploadPopup}>Отмена</button>
            </div>
          </div>
        </div>
      )}
      {confirmDelete && (
        <div className="popup-overlay">
          <div className="popup-content">
            {confirmDelete.type === 'category' ? (
              <>
                <h2>Удалить сервис?</h2>
                <p>Вы действительно хотите удалить сервис «{confirmDelete.data.name}»?</p>
              </>
            ) : (
              <>
                <h2>Удалить товар?</h2>
                <p>Вы действительно хотите удалить товар «{confirmDelete.data.product.name}»?</p>
              </>
            )}
            <div className="popup-buttons">
              <button onClick={confirmDeleteAction}>Да</button>
              <button onClick={cancelDeleteAction}>Нет</button>
            </div>
          </div>
        </div>
      )}
      {showEditProductPopup && editProductData && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>Редактировать товар</h2>
            <div className="input-group">
              <input
                type="text"
                placeholder="Название"
                value={editProductData.updated.name}
                onChange={(e) => handleEditProductFieldChange('name', e.target.value)}
              />
              <input
                type="text"
                placeholder="Описание"
                value={editProductData.updated.description}
                onChange={(e) => handleEditProductFieldChange('description', e.target.value)}
              />
              <input
                type="text"
                placeholder="Цена"
                value={editProductData.updated.price}
                onChange={(e) => handleEditProductFieldChange('price', e.target.value)}
              />
              <input
                type="text"
                placeholder="Продано"
                value={editProductData.updated.soldUnits}
                onChange={(e) => handleEditProductFieldChange('soldUnits', e.target.value)}
                style={{
                  padding: '10px',
                  border: '1px solid #555',
                  borderRadius: '4px',
                  backgroundColor: '#444',
                  color: '#fff'
                }}
              />
              <input
                type="text"
                placeholder="Единица товара"
                value={editProductData.updated.unit || ''}
                onChange={(e) => handleEditProductFieldChange('unit', e.target.value)}
              />
            </div>
            <div className="popup-buttons">
              <button onClick={saveEditedProduct}>Сохранить</button>
              <button
                onClick={() => {
                  setShowEditProductPopup(false)
                  setEditProductData(null)
                }}
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
      {showEditCategoryPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>Редактировать сервис</h2>
            <input
              type="text"
              placeholder="Название сервиса"
              value={editCategoryData.name}
              onChange={(e) => setEditCategoryData({ ...editCategoryData, name: e.target.value })}
            />
            <div className="popup-buttons">
              <button onClick={handleSaveEditedCategory}>Сохранить</button>
              <button onClick={() => setShowEditCategoryPopup(false)}>Отмена</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
