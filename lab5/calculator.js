/**
 * Калькулятор стоимости заказа
 * Задание 5 - Разработка пользовательского Web-интерфейса
 */

// Инициализация после полной загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM загружен, инициализируем калькулятор...');
    
    // Получаем элементы DOM
    const calculatorForm = document.getElementById('calculatorForm');
    const productSelect = document.getElementById('productSelect');
    const quantityInput = document.getElementById('quantityInput');
    const quantityError = document.getElementById('quantityError');
    const resultContainer = document.getElementById('resultContainer');
    const resultValue = document.getElementById('resultValue');
    const calculationDetails = document.getElementById('calculationDetails');
    const resetButton = document.getElementById('resetButton');
    
    // Регулярное выражение для проверки количества (только цифры, от 1 до 999)
    const quantityRegex = /^[1-9][0-9]{0,2}$/;
    
    // Объект с информацией о товарах
    const products = {
        '2999.99': { name: 'Ноутбук', price: 2999.99 },
        '1599.50': { name: 'Смартфон', price: 1599.50 },
        '899.99': { name: 'Планшет', price: 899.99 },
        '249.99': { name: 'Наушники', price: 249.99 },
        '179.50': { name: 'Клавиатура', price: 179.50 }
    };
    
    /**
     * Проверяет корректность введенного количества
     * @param {string} value - значение для проверки
     * @returns {boolean} - true если корректно, false если нет
     */
    function validateQuantity(value) {
        if (!quantityRegex.test(value)) {
            return false;
        }
        
        const num = parseInt(value, 10);
        return num >= 1 && num <= 999;
    }
    
    /**
     * Показывает сообщение об ошибке
     * @param {boolean} show - показывать или скрывать ошибку
     */
    function showError(show) {
        if (show) {
            quantityError.style.display = 'block';
            quantityInput.classList.add('is-invalid');
            quantityInput.classList.remove('is-valid');
        } else {
            quantityError.style.display = 'none';
            quantityInput.classList.remove('is-invalid');
            quantityInput.classList.add('is-valid');
        }
    }
    
    /**
     * Рассчитывает стоимость заказа
     * @param {number} price - цена товара
     * @param {number} quantity - количество
     * @returns {number} - общая стоимость
     */
    function calculateTotal(price, quantity) {
        return price * quantity;
    }
    
    /**
     * Форматирует число как денежную сумму
     * @param {number} amount - сумма
     * @returns {string} - отформатированная сумма
     */
    function formatCurrency(amount) {
        return amount.toLocaleString('ru-RU', {
            style: 'currency',
            currency: 'RUB',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }
    
    /**
     * Отображает результат расчета
     * @param {number} total - общая стоимость
     * @param {string} productName - название товара
     * @param {number} price - цена товара
     * @param {number} quantity - количество
     */
    function displayResult(total, productName, price, quantity) {
        resultValue.textContent = formatCurrency(total);
        calculationDetails.textContent = 
            'Выбран товар: ${productName} (${formatCurrency(price)} за шт.) в количестве: ${quantity} шт.';
        resultContainer.style.display = 'block';
        
        // Плавная прокрутка к результату
        resultContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    /**
     * Сбрасывает форму и скрывает результат
     */
    function resetCalculator() {
        calculatorForm.reset();
        resultContainer.style.display = 'none';
quantityInput.classList.remove('is-valid', 'is-invalid');
        quantityError.style.display = 'none';
        productSelect.focus();
    }
    
    /**
     * Обработчик отправки формы
     * @param {Event} event - событие отправки формы
     */
    function handleSubmit(event) {
        event.preventDefault();
        
        // Получаем значения из формы
        const selectedValue = productSelect.value;
        const quantity = quantityInput.value.trim();
        
        // Проверяем выбран ли товар
        if (!selectedValue) {
            alert('Пожалуйста, выберите товар из списка!');
            productSelect.focus();
            return;
        }
        
        // Проверяем корректность количества
        if (!validateQuantity(quantity)) {
            showError(true);
            quantityInput.focus();
            return;
        }
        
        // Скрываем ошибку если она была показана
        showError(false);
        
        // Получаем данные о товаре
        const product = products[selectedValue];
        const quantityNum = parseInt(quantity, 10);
        
        // Рассчитываем стоимость
        const total = calculateTotal(product.price, quantityNum);
        
        // Отображаем результат
        displayResult(total, product.name, product.price, quantityNum);
    }
    
    /**
     * Обработчик ввода в поле количества (валидация в реальном времени)
     */
    function handleQuantityInput() {
        const value = quantityInput.value.trim();
        
        if (value === '') {
            showError(false);
            return;
        }
        
        if (!validateQuantity(value)) {
            showError(true);
        } else {
            showError(false);
        }
    }
    
    // Назначаем обработчики событий
    calculatorForm.addEventListener('submit', handleSubmit);
    quantityInput.addEventListener('input', handleQuantityInput);
    resetButton.addEventListener('click', resetCalculator);
    
    // Обработчик для очистки ошибки при выборе товара
    productSelect.addEventListener('change', function() {
        const value = quantityInput.value.trim();
        if (value && validateQuantity(value)) {
            showError(false);
        }
    });
    
    // Обработчик для клавиши Enter в поле количества
    quantityInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            calculatorForm.dispatchEvent(new Event('submit'));
        }
    });
    
    // Фокус на поле выбора товара при загрузке
    productSelect.focus();
    
    console.log('Калькулятор инициализирован успешно!');
});

// Проверка на наличие глобальных ошибок
window.addEventListener('error', function(event) {
    console.error('Произошла ошибка:', event.error);
});

// Проверка загрузки страницы
window.addEventListener('load', function() {
    console.log('Страница полностью загружена');
});