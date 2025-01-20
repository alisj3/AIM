import './Neirostorage.css'
import {useState} from 'react'

export function Neirostorage(){
    const [activeTable, setActiveTable] = useState('table1');

    const handleTableChange = (table) => {
        setActiveTable(table);
    };

    return(
        <div className='neirostorage'>
            <div className='neirostorage-title'>
                <h1>Нейросклад</h1>
                <p>Создавайте товары и управляйте своим бизнесом</p>
            </div>
            
            <div className='neirostorage-container'>

                <div className="table-title">
                    <h1>Категории</h1>
                    <div className="button-group">
                        <button onClick={() => handleTableChange('table1')}>Категория 1</button>
                        <button onClick={() => handleTableChange('table2')}>Категория 2</button>
                        <button onClick={() => handleTableChange('table3')}>Категория 3</button>
                    </div>
                </div>
             

            <div className="dynamic-table">
                <div className="search-bar neiro-search">
                    <img src="/icons/search.png" className="search-icon" />
                    <input type="text" className="search-input" placeholder="Поиск" />
                </div>
                {activeTable === 'table1' && (
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
                        <tr>
                        <td>Data 1A</td>
                        <td>Data 1B</td>
                        <td>Data 1C</td>
                        <td>Data 1C</td>
                        </tr>
                        <tr>
                        <td>Data 2A</td>
                        <td>Data 2B</td>
                        <td>Data 2C</td>
                        <td>Data 1C</td>
                        </tr>
                    </tbody>
                    </table>
                )}

                {activeTable === 'table2' && (
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
                        <tr>
                        <td>Info A1</td>
                        <td>Info B1</td>
                        <td>Info C1</td>
                        <td>Info C1</td>
                        </tr>
                        <tr>
                        <td>Info A2</td>
                        <td>Info B2</td>
                        <td>Info C2</td>
                        <td>Info C1</td>
                        </tr>
                    </tbody>
                    </table>
                )}

                {activeTable === 'table3' && (
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
                        <tr>
                        <td>Item X1</td>
                        <td>Item Y1</td>
                        <td>Item Z1</td>
                        <td>Item Z1</td>
                        </tr>
                        <tr>
                        <td>Item X2</td>
                        <td>Item Y2</td>
                        <td>Item Z2</td>
                        <td>Item Z1</td>
                        </tr>
                    </tbody>
                    </table>
                )}
                </div>
            </div>
        </div>
    )
}