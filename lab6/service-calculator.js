/**
 * Калькулятор стоимости услуги
 * Задание 6 - Разработка пользовательского Web-интерфейса
 */

// Инициализация после полной загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM загружен, инициализируем калькулятор услуги...');
    
    // Получаем элементы DOM
    const serviceForm = document.getElementById('serviceForm');
    const quantityInput = document.getElementById('quantityInput');
    const quantityRange = document.getElementById('quantityRange');
    const optionsSection = document.getElementById('optionsSection');
    const propertiesSection = document.getElementById('propertiesSection');
    const optionsSelect = document.getElementById('optionsSelect');
    const propertyCheckbox = document.getElementById('propertyCheckbox');
    const totalPriceElement = document.getElementById('totalPrice');
    const priceDetailsElement = document.getElementById('priceDetails');
    const detailsToggle = document.getElementById('detailsToggle');
    const calculationDetails = document.getElementById('calculationDetails');
    const detailsList = document.getElementById('detailsList');
    
    // Элементы радиокнопок
    const serviceRadios = document.querySelectorAll('input[name="serviceType"]');
    const serviceOptions = document.querySelectorAll('.service-option');
    
    // Цены и настройки услуг
    const servicePrices = {
        basic: { basePrice: 500, hasOptions: false, hasProperties: false },
        standard: { basePrice: 800, hasOptions: true, hasProperties: false },
        premium: { basePrice: 1200, hasOptions: false, hasProperties: true }
    };
    
    // Дополнительные стоимости для опций
    const optionPrices = {
        default: 0,
        fast: 200,
        priority: 400,
        vip: 600
    };
    
    // Текущее состояние калькулятора
    let currentState = {
        serviceType: 'basic',
        quantity: 1,
        selectedOption: 'default',
        hasProperty: false
    };
    
    /**
     * Форматирует число как денежную сумму
     * @param {number} amount - сумма
     * @returns {string} - отформатированная сумма
     */
    function formatCurrency(amount) {
        return amount.toLocaleString('ru-RU', {
            style: 'currency',
            currency: 'RUB',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
    }
    
    /**
     * Показывает или скрывает динамические секции
     * @param {string} serviceType - тип выбранной услуги
     */
    function updateDynamicSections(serviceType) {
        const service = servicePrices[serviceType];
        
        // Управляем видимостью секции опций
        if (service.hasOptions) {
            optionsSection.classList.remove('hidden');
        } else {
            optionsSection.classList.add('hidden');
        }
        
        // Управляем видимостью секции свойств
        if (service.hasProperties) {
            propertiesSection.classList.remove('hidden');
        } else {
            propertiesSection.classList.add('hidden');
        }
    }
    
    /**
     * Обновляет визуальный выбор услуги
     * @param {string} serviceType - тип выбранной услуги
     */
    function updateServiceSelection(serviceType) {
        // Убираем выделение со всех опций
        serviceOptions.forEach(option => {
            option.classList.remove('selected');
        });
        
        // Добавляем выделение выбранной опции
        const selectedOption = document.querySelector(`.service-option[data-service="${serviceType}"]`);
        if (selectedOption) {
            selectedOption.classList.add('selected');
        }
    }
    
    /**
     * Рассчитывает общую стоимость
     * @returns {object} - результат расчета
     */
    function calculateTotal() {
        const service = servicePrices[currentState.serviceType];
        let baseTotal = service.basePrice * currentState.quantity;
        
        // Добавляем стоимость опции (если есть)
        let optionTotal = 0;
        if (service.hasOptions) {
            optionTotal = optionPrices[currentState.selectedOption] * currentState.quantity;
        }
        
        // Добавляем стоимость свойства (если есть)
        let propertyMultiplier = 1;
        if (service.hasProperties && currentState.hasProperty) {
            propertyMultiplier = 1.5; // +50%
        }
        
        // Итоговая стоимость
        const finalTotal = (baseTotal + optionTotal) * propertyMultiplier;
        
        return {
            baseTotal,
            optionTotal,
            propertyMultiplier,
            finalTotal
        };
    }
    
    /**
     * Обновляет отображение цены
     */
    function updatePriceDisplay() {
        const result = calculateTotal();
        const service = servicePrices[currentState.serviceType];
        
        // Обновляем итоговую цену
        totalPriceElement.textContent = formatCurrency(result.finalTotal);
        
        // Обновляем краткую информацию
        let detailsText = '';
        if (service.hasProperties && currentState.hasProperty) {
            detailsText = `${getServiceName(currentState.serviceType)} × ${currentState.quantity} шт. + гарантия = ${formatCurrency(result.finalTotal)}`;
        } else if (service.hasOptions && currentState.selectedOption !== 'default') {
            detailsText = `${getServiceName(currentState.serviceType)} × ${currentState.quantity} шт. + опция = ${formatCurrency(result.finalTotal)}`;
        } else {
            detailsText = `${getServiceName(currentState.serviceType)} × ${currentState.quantity} шт. = ${formatCurrency(result.finalTotal)}`;
        }
        priceDetailsElement.textContent = detailsText;
        
        // Обновляем детали расчета
        updateCalculationDetails(result);
    }
    
    /**
     * Обновляет детали расчета
     * @param {object} result - результат расчета
     */
    function updateCalculationDetails(result) {
        const service = servicePrices[currentState.serviceType];
        detailsList.innerHTML = '';
        
        // Базовая стоимость
        const baseItem = document.createElement('li');
        baseItem.textContent = `Базовая стоимость: ${formatCurrency(service.basePrice)} × ${currentState.quantity} = ${formatCurrency(result.baseTotal)}`;
        detailsList.appendChild(baseItem);
        
        // Стоимость опции (если есть)
        if (service.hasOptions && result.optionTotal > 0) {
            const optionItem = document.createElement('li');
            optionItem.textContent = `Опция "${getOptionName(currentState.selectedOption)}": ${formatCurrency(optionPrices[currentState.selectedOption])} × ${currentState.quantity} = ${formatCurrency(result.optionTotal)}`;
            detailsList.appendChild(optionItem);
        }
        
        // Гарантия качества (если есть)
        if (service.hasProperties && currentState.hasProperty) {
            const propertyItem = document.createElement('li');
            propertyItem.textContent = `Гарантия качества: +50% к стоимости`;
            detailsList.appendChild(propertyItem);
        }
        
        // Итоговая стоимость
        const totalItem = document.createElement('li');
        totalItem.className = 'fw-bold mt-2';
        totalItem.textContent = `Итого: ${formatCurrency(result.finalTotal)}`;
        detailsList.appendChild(totalItem);
    }
    
    /**
     * Возвращает название услуги по типу
     * @param {string} serviceType - тип услуги
     * @returns {string} - название услуги
     */
    function getServiceName(serviceType) {
        const names = {
            basic: 'Базовая услуга',
            standard: 'Стандартная услуга',
            premium: 'Премиум услуга'
        };
        return names[serviceType] || 'Услуга';
    }
    
    /**
     * Возвращает название опции по значению
     * @param {string} optionValue - значение опции
     * @returns {string} - название опции
     */
    function getOptionName(optionValue) {
        const names = {
            default: 'Стандартная',
            fast: 'Быстрое выполнение',
            priority: 'Приоритетное выполнение',
            vip: 'VIP выполнение'
        };
        return names[optionValue] || 'Опция';
    }
    
    /**
     * Обработчик изменения типа услуги
     */
    function handleServiceTypeChange() {
        const selectedRadio = document.querySelector('input[name="serviceType"]:checked');
        if (!selectedRadio) return;
        
        currentState.serviceType = selectedRadio.value;
        
        // Обновляем динамические секции
        updateDynamicSections(currentState.serviceType);
        
        // Обновляем визуальный выбор
        updateServiceSelection(currentState.serviceType);
        
        // Обновляем цену
        updatePriceDisplay();
        
        console.log('Тип услуги изменен на:', currentState.serviceType);
    }
    
    /**
     * Обработчик изменения количества
     */
    function handleQuantityChange() {
        const quantity = parseInt(quantityInput.value, 10);
        
        // Проверяем границы
        if (quantity < 1) {
            quantityInput.value = 1;
            currentState.quantity = 1;
        } else if (quantity > 100) {
            quantityInput.value = 100;
            currentState.quantity = 100;
        } else {
            currentState.quantity = quantity;
        }
        
        // Синхронизируем range и input
        quantityRange.value = currentState.quantity;
        
        // Обновляем цену
        updatePriceDisplay();
        
        console.log('Количество изменено на:', currentState.quantity);
    }
    
    /**
     * Обработчик изменения опции
     */
    function handleOptionChange() {
        currentState.selectedOption = optionsSelect.value;
        updatePriceDisplay();
        console.log('Опция изменена на:', currentState.selectedOption);
    }
    
    /**
     * Обработчик изменения свойства
     */
    function handlePropertyChange() {
        currentState.hasProperty = propertyCheckbox.checked;
        updatePriceDisplay();
        console.log('Свойство изменено:', currentState.hasProperty ? 'включено' : 'выключено');
    }
    
    // Назначаем обработчики событий
    
    // Для радиокнопок услуг
    serviceRadios.forEach(radio => {
        radio.addEventListener('change', handleServiceTypeChange);
    });
    
    // Для кликов по блокам услуг
    serviceOptions.forEach(option => {
        option.addEventListener('click', function() {
            const serviceType = this.getAttribute('data-service');
            const radio = document.getElementById(`${serviceType}Service`);
            if (radio) {
                radio.checked = true;
                handleServiceTypeChange();
            }
        });
    });
    
    // Для поля количества
    quantityInput.addEventListener('input', handleQuantityChange);
    quantityInput.addEventListener('change', handleQuantityChange);
    
    // Для ползунка количества
    quantityRange.addEventListener('input', function() {
        quantityInput.value = this.value;
        handleQuantityChange();
    });
    
    // Для выбора опции
    optionsSelect.addEventListener('change', handleOptionChange);
    
    // Для чекбокса свойства
    propertyCheckbox.addEventListener('change', handlePropertyChange);
    
    // Для кнопки показа деталей
    detailsToggle.addEventListener('click', function() {
        const isVisible = calculationDetails.style.display === 'block';
        calculationDetails.style.display = isVisible ? 'none' : 'block';
        this.innerHTML = isVisible 
            ? '<i class="bi bi-info-circle me-1"></i>Показать детали расчета'
            : '<i class="bi bi-x-circle me-1"></i>Скрыть детали расчета';
    });
    
    // Инициализация при загрузке
    function initializeCalculator() {
        // Устанавливаем начальное состояние
        updateServiceSelection(currentState.serviceType);
        updateDynamicSections(currentState.serviceType);
        updatePriceDisplay();
        
        console.log('Калькулятор инициализирован:', currentState);
    }
    
    // Запускаем инициализацию
    initializeCalculator();
});

// Обработка глобальных ошибок
window.addEventListener('error', function(event) {
    console.error('Произошла ошибка:', event.error);
});