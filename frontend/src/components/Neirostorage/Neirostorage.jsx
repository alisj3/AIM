import './Neirostorage.css';
import { useState } from 'react';
import CanvasNeuron from "../canvas/CanvasNeuron"

export function Neirostorage() {
  const [categories, setCategories] = useState([
  ]);

  const [activeTable, setActiveTable] = useState('');
  const [newRow, setNewRow] = useState(['', '', '', '']);
  const [popupSeen, setPopupSeen] = useState(false)

  const handleTableChange = (table) => {
    setActiveTable(table);
  };

  const togglePop = () => {
    setPopupSeen(!popupSeen)
  }

  const addCategory = () => {
    const newCategoryId = `table${categories.length + 1}`;
    setCategories((prevCategories) => [
      ...prevCategories,
      { id: newCategoryId, name: `Категория ${categories.length + 1}`, data: [] },
    ]);
    setActiveTable(newCategoryId);
  };

  const handleInputChange = (index, value) => {
    const updatedRow = [...newRow];
    updatedRow[index] = value;
    setNewRow(updatedRow);
  };

  const addRowToTable = () => {
    setCategories((prevCategories) =>
      prevCategories.map((category) =>
        category.id === activeTable
          ? { ...category, data: [...category.data, newRow] }
          : category
      )
    );
    setNewRow(['', '', '', '']);
  };

  return (
    <div className="neirostorage">
      <div className="neirostorage-title">
        <h1>Нейросклад</h1>
        <p>Создавайте товары и управляйте своим бизнесом</p>
      </div>

      <div className="neirostorage-container">
        <div className="table-title">
          <h1>Категории</h1>
          <div className="button-group">
            {categories.map((category) => (
              <button
                key={category.id}
                className={activeTable === category.id ? 'active' : ''}
                onClick={() => handleTableChange(category.id)}
              >
                {category.name}
              </button>
            ))}
            <button className="add-category-button" onClick={addCategory}>
              +
            </button>
          </div>
        </div>

        <div className="dynamic-table">
          <div className="search-bar neiro-search">
            <img src="/icons/search.png" className="search-icon" alt="search" />
            <input type="text" className="search-input" placeholder="Поиск" />
          </div>

          {categories.map((category) =>
            activeTable === category.id ? (
              <div className='table' key={category.id}>
                <table>
                  <thead>
                    <tr>
                      <th>Наименование Товара</th>
                      <th>Описание</th>
                      <th>Цена</th>
                      <th>Валюта</th>
                    </tr>
                  </thead>
                  <tbody>
                    {category.data.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>

                {popupSeen ? 
                <div className="add-data-form">
                  <h3>Добавить данные</h3>
                  <div className="input-group">
                    <input
                      type="text"
                      placeholder="Наименование"
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
                      placeholder="Валюта"
                      value={newRow[3]}
                      onChange={(e) => handleInputChange(3, e.target.value)}
                    />
                  </div>
                  <button className="add-data-button" onClick={addRowToTable}>
                    Добавить
                  </button>
                </div>
                 : null } 
              </div>
            ) : null
          )}
                <button className='create-product' onClick={togglePop}>Создать Товар</button>   
        </div>
      </div>
    </div>
  );
}
