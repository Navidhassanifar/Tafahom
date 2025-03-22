document.addEventListener('DOMContentLoaded', () => {
    // تابع برای مخفی کردن همه بخش‌ها
    function hideAllSections(exceptSection = null) {
        const hero = document.querySelector('.hero');
        const sections = document.querySelectorAll('.section');
        const dashboard = document.getElementById('dashboard');

        hero.classList.add('hidden');
        hero.style.display = 'none';
        sections.forEach(section => {
            section.classList.add('hidden');
            section.style.display = 'none';
        });

        if (exceptSection) {
            exceptSection.classList.remove('hidden');
            exceptSection.style.display = 'block';
        }
    }

    // تنظیم حالت اولیه: فقط بخش خانه نمایش داده بشه
    const hero = document.querySelector('.hero');
    hideAllSections(hero);

    // مدیریت منوی همبرگری
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // بستن منو بعد از کلیک روی لینک‌ها تو موبایل
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 600) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    });

    // افکت تعاملی برای دکمه‌ها
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.style.boxShadow = '0 0 30px #00FF99';
            setTimeout(() => {
                btn.style.boxShadow = '0 0 20px #00B4D8';
            }, 300);
        });
    });

    // اسکرول نرم برای لینک‌ها و مدیریت نمایش بخش‌ها
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const hero = document.querySelector('.hero');
            const dashboard = document.getElementById('dashboard');

            if (targetId === 'home') {
                hideAllSections(hero);
                hero.scrollIntoView({ behavior: 'smooth' });
            } else if (targetId === 'about') {
                const aboutSection = document.getElementById('about');
                hideAllSections(aboutSection);
                aboutSection.scrollIntoView({ behavior: 'smooth' });
            } else if (targetId === 'features') {
                const featuresSection = document.getElementById('features');
                hideAllSections(featuresSection);
                featuresSection.scrollIntoView({ behavior: 'smooth' });
            } else if (targetId === 'future') {
                const futureSection = document.getElementById('future');
                hideAllSections(futureSection);
                futureSection.scrollIntoView({ behavior: 'smooth' });
            } else if (targetId === 'testimonials') {
                const testimonialsSection = document.getElementById('testimonials');
                hideAllSections(testimonialsSection);
                testimonialsSection.scrollIntoView({ behavior: 'smooth' });
            } else if (targetId === 'contact') {
                const contactSection = document.getElementById('contact');
                hideAllSections(contactSection);
                contactSection.scrollIntoView({ behavior: 'smooth' });
            } else if (targetId === 'dashboard') {
                hideAllSections(dashboard);
                dashboard.scrollIntoView({ behavior: 'smooth' });
                // نمایش لینک‌های داشبورد و خروج
                document.getElementById('dashboard-link').style.display = 'inline';
                document.getElementById('logout-btn').style.display = 'inline';
                // مخفی کردن بقیه لینک‌ها
                document.querySelectorAll('a[href^="#"]:not(#dashboard-link):not(#logout-btn)').forEach(link => {
                    link.style.display = 'none';
                });
                const code = document.querySelector('.company-code')?.textContent;
                if (code) {
                    loadDashboard(code);
                }
            }
        });
    });

    // انیمیشن برای کارت‌ها
    const cards = document.querySelectorAll('.card');
    const sectionsToAnimate = ['features', 'future', 'testimonials', 'dashboard'];

    sectionsToAnimate.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        const sectionCards = section.querySelectorAll('.card');
        const sectionTable = section.querySelector('.collaboration-table');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    sectionCards.forEach((card, index) => {
                        if (!card.classList.contains('visible')) {
                            setTimeout(() => {
                                card.classList.add('visible');
                            }, index * 200);
                        }
                    });
                    if (sectionTable && !sectionTable.classList.contains('visible')) {
                        sectionTable.classList.add('visible');
                    }
                }
            });
        }, { threshold: 0.3 });
        observer.observe(section);
    });

    // مدیریت دکمه بازگشت به بالا
    const backToTopBtn = document.getElementById('back-to-top');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.style.display = 'flex';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // مدیریت فرم تماس
    const contactForm = document.getElementById('contact-form');
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        alert('پیام شما با موفقیت ارسال شد!');
        contactForm.reset();
    });

    // مدیریت فرم شناور (Modal)
    const startBtn = document.getElementById('start-btn');
    const modal = document.getElementById('check-modal');
    const closeBtn = document.querySelector('.close-btn');
    const form = document.querySelector('.check-form');
    const resultDiv = document.querySelector('.result');
    const companyCard = document.querySelector('.company-card');
    const subscriptionCard = document.querySelector('.subscription-card');
    const paymentModal = document.querySelector('.payment-modal');
    const successMessage = document.querySelector('.success-message');
    const loading = document.querySelector('.loading');
    const subscriptionStatus = document.querySelector('.subscription-status');
    const companyCodeInput = document.querySelector('#company-code');
    const companyCodeError = document.querySelector('#company-code-error');

    // باز کردن فرم شناور با دکمه شروع
    startBtn.addEventListener('click', () => {
        modal.style.display = 'flex';
        resultDiv.style.display = 'none';
        companyCodeError.style.display = 'none';
    });

    // بستن فرم شناور
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        resultDiv.style.display = 'none';
        subscriptionCard.style.display = 'none';
        paymentModal.style.display = 'none';
        successMessage.style.display = 'none';
        loading.style.display = 'none';
        companyCodeError.style.display = 'none';
    });

    // بستن فرم با کلیک روی پس‌زمینه
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            resultDiv.style.display = 'none';
            subscriptionCard.style.display = 'none';
            paymentModal.style.display = 'none';
            successMessage.style.display = 'none';
            loading.style.display = 'none';
            companyCodeError.style.display = 'none';
        }
    });

    // اعتبارسنجی کد شرکت هنگام تایپ
    companyCodeInput.addEventListener('input', () => {
        const value = companyCodeInput.value;
        const regex = /^[0-9]*$/; // فقط عدد
        if (!regex.test(value)) {
            companyCodeError.textContent = 'فقط عدد مجاز است!';
            companyCodeError.style.display = 'block';
        } else if (value.length !== 6) {
            companyCodeError.textContent = 'کد ثبت شرکت باید 6 رقمی باشد!';
            companyCodeError.style.display = 'block';
        } else {
            companyCodeError.style.display = 'none';
        }
    });

    // شبیه‌سازی استعلام شرکت با جزئیات و سطح شرکت
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const code = companyCodeInput.value;
        const regex = /^[0-9]{6}$/; // دقیقاً 6 رقم
        if (regex.test(code)) {
            // چک کردن localStorage برای اطلاعات ذخیره‌شده
            const savedCompany = JSON.parse(localStorage.getItem('companyData_' + code));
            if (savedCompany) {
                // استفاده از داده‌های ذخیره‌شده
                document.querySelector('.company-name').textContent = savedCompany.name;
                document.querySelector('.company-code').textContent = savedCompany.code;
                document.querySelector('.company-date').textContent = savedCompany.date;
                document.querySelector('.company-address').textContent = savedCompany.address;
                document.querySelector('.company-status').textContent = savedCompany.status;
                document.querySelector('.company-field').textContent = savedCompany.field;
                document.querySelector('.company-tier').textContent = savedCompany.tier;

                // چک کردن وضعیت اشتراک
                const subscription = JSON.parse(localStorage.getItem('subscription_' + code));
                if (subscription && subscription.active) {
                    const expiryDate = new Date(subscription.expiry).toLocaleDateString('fa-IR');
                    subscriptionStatus.textContent = `اشتراک فعال است تا ${expiryDate}`;
                    subscriptionStatus.style.display = 'block';
                } else {
                    subscriptionStatus.style.display = 'none';
                }

                companyCard.style.display = 'block';
                resultDiv.style.display = 'block';
                subscriptionCard.style.display = 'none';
                paymentModal.style.display = 'none';
                successMessage.style.display = 'none';
                loading.style.display = 'none';
            } else {
                // شبیه‌سازی داده‌های شرکت
                const companyNames = ["شرکت نمونه الف", "شرکت فناوری نوین", "شرکت آینده‌سازان"];
                const dates = ["1398/05/12", "1400/03/20", "1395/11/30"];
                const addresses = ["تهران، خیابان آزادی", "اصفهان، بلوار ملت", "شیراز، خیابان کریم‌خان"];
                const statuses = ["فعال", "غیرفعال", "در حال ثبت"];
                const fields = ["فناوری اطلاعات", "تولید صنعتی", "خدمات مالی"];
                const tiers = ["Tier 1", "Tier 2", "Tier 3"];

                const randomIndex = Math.floor(Math.random() * 3);
                const isFound = Math.random() > 0.2; // 80% شانس پیدا شدن شرکت

                if (isFound) {
                    // پر کردن اطلاعات کارت
                    const companyData = {
                        name: companyNames[randomIndex],
                        code: code,
                        date: dates[randomIndex],
                        address: addresses[randomIndex],
                        status: statuses[randomIndex],
                        field: fields[randomIndex],
                        tier: tiers[randomIndex]
                    };

                    // ذخیره اطلاعات شرکت در localStorage
                    localStorage.setItem('companyData_' + code, JSON.stringify(companyData));

                    document.querySelector('.company-name').textContent = companyData.name;
                    document.querySelector('.company-code').textContent = companyData.code;
                    document.querySelector('.company-date').textContent = companyData.date;
                    document.querySelector('.company-address').textContent = companyData.address;
                    document.querySelector('.company-status').textContent = companyData.status;
                    document.querySelector('.company-field').textContent = companyData.field;
                    document.querySelector('.company-tier').textContent = companyData.tier;

                    // چک کردن وضعیت اشتراک از localStorage
                    const subscription = JSON.parse(localStorage.getItem('subscription_' + code));
                    if (subscription && subscription.active) {
                        const expiryDate = new Date(subscription.expiry).toLocaleDateString('fa-IR');
                        subscriptionStatus.textContent = `اشتراک فعال است تا ${expiryDate}`;
                        subscriptionStatus.style.display = 'block';
                    } else {
                        subscriptionStatus.style.display = 'none';
                    }

                    companyCard.style.display = 'block';
                    resultDiv.style.display = 'block';
                    subscriptionCard.style.display = 'none';
                    paymentModal.style.display = 'none';
                    successMessage.style.display = 'none';
                    loading.style.display = 'none';
                } else {
                    companyCard.style.display = 'none';
                    subscriptionCard.style.display = 'none';
                    paymentModal.style.display = 'none';
                    resultDiv.style.display = 'block';
                    successMessage.textContent = 'شرکت با کد ' + code + ' یافت نشد. لطفاً کد را بررسی کنید.';
                    successMessage.style.display = 'block';
                    loading.style.display = 'none';
                }
            }
        } else {
            companyCodeError.textContent = 'کد ثبت شرکت باید 6 رقمی و فقط عدد باشد!';
            companyCodeError.style.display = 'block';
        }
    });

    // مدیریت دکمه خرید اشتراک
    document.querySelector('.subscribe-btn').addEventListener('click', () => {
        const tier = document.querySelector('.company-tier').textContent;
        let price;
        switch (tier) {
            case 'Tier 1':
                price = '10,000,000';
                break;
            case 'Tier 2':
                price = '5,000,000';
                break;
            case 'Tier 3':
                price = '2,000,000';
                break;
            default:
                price = 'نامشخص';
        }

        document.querySelector('.subscription-tier').textContent = tier;
        document.querySelector('.subscription-price').textContent = price;
        companyCard.style.display = 'none';
        subscriptionCard.style.display = 'block';
        paymentModal.style.display = 'none';
        successMessage.style.display = 'none';
        loading.style.display = 'none';
    });

    // مدیریت دکمه پرداخت (باز کردن درگاه فیک)
    document.querySelector('.pay-btn').addEventListener('click', () => {
        subscriptionCard.style.display = 'none';
        paymentModal.style.display = 'flex';
        successMessage.style.display = 'none';
        loading.style.display = 'none';
    });

    // مدیریت فرم درگاه پرداخت فیک
    const paymentForm = document.querySelector('.payment-form');
    const closePaymentBtn = document.querySelector('.close-payment-btn');
    const backBtn = document.querySelector('.back-btn');
    const cardNumberInput = document.querySelector('#card-number');
    const expiryDateInput = document.querySelector('#expiry-date');
    const cvvInput = document.querySelector('#cvv');
    const cardNumberError = document.querySelector('#card-number-error');
    const expiryDateError = document.querySelector('#expiry-date-error');
    const cvvError = document.querySelector('#cvv-error');

    // فرمت خودکار شماره کارت (هر 4 رقم یه فاصله)
    cardNumberInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, ''); // فقط عدد
        value = value.replace(/(\d{4})/g, '$1 ').trim(); // هر 4 رقم یه فاصله
        e.target.value = value;

        const digitsOnly = value.replace(/\s/g, '');
        const regex = /^[0-9]{16}$/;
        if (!regex.test(digitsOnly)) {
            cardNumberError.textContent = 'شماره کارت باید 16 رقمی باشد!';
            cardNumberError.style.display = 'block';
        } else {
            cardNumberError.style.display = 'none';
        }
    });

    // اعتبارسنجی تاریخ انقضا
    expiryDateInput.addEventListener('input', () => {
        const value = expiryDateInput.value;
        const regex = /^(0[1-9]|1[0-2])\/\d{2}$/; // فرمت MM/YY
        if (!regex.test(value)) {
            expiryDateError.textContent = 'تاریخ انقضا باید به فرمت MM/YY باشد!';
            expiryDateError.style.display = 'block';
        } else {
            expiryDateError.style.display = 'none';
        }
    });

    // اعتبارسنجی CVV
    cvvInput.addEventListener('input', () => {
        const value = cvvInput.value;
        const regex = /^[0-9]{3,4}$/; // 3 یا 4 رقم
        if (!regex.test(value)) {
            cvvError.textContent = 'CVV باید 3 یا 4 رقم باشد!';
            cvvError.style.display = 'block';
        } else {
            cvvError.style.display = 'none';
        }
    });

    paymentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const cardNumber = cardNumberInput.value.replace(/\s/g, ''); // حذف فاصله‌ها
        const expiryDate = expiryDateInput.value;
        const cvv = cvvInput.value;

        const cardNumberRegex = /^[0-9]{16}$/;
        const expiryDateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
        const cvvRegex = /^[0-9]{3,4}$/;

        let isValid = true;

        // پاک کردن پیام‌های خطا قبل از اعتبارسنجی
        cardNumberError.style.display = 'none';
        expiryDateError.style.display = 'none';
        cvvError.style.display = 'none';

        if (!cardNumberRegex.test(cardNumber)) {
            cardNumberError.textContent = 'شماره کارت باید 16 رقمی باشد!';
            cardNumberError.style.display = 'block';
            isValid = false;
        }

        if (!expiryDateRegex.test(expiryDate)) {
            expiryDateError.textContent = 'تاریخ انقضا باید به فرمت MM/YY باشد!';
            expiryDateError.style.display = 'block';
            isValid = false;
        }

        if (!cvvRegex.test(cvv)) {
            cvvError.textContent = 'CVV باید 3 یا 4 رقم باشد!';
            cvvError.style.display = 'block';
            isValid = false;
        }

        if (isValid) {
            // نمایش انیمیشن لودینگ
            loading.style.display = 'block';
            setTimeout(() => {
                // شبیه‌سازی پرداخت موفق
                const code = document.querySelector('.company-code').textContent;
                const tier = document.querySelector('.company-tier').textContent;
                const expiryDate = new Date();
                expiryDate.setMonth(expiryDate.getMonth() + 1); // اشتراک یک ماهه
                const subscription = {
                    active: true,
                    tier: tier,
                    expiry: expiryDate
                };
                localStorage.setItem('subscription_' + code, JSON.stringify(subscription));

                paymentModal.style.display = 'none';
                loading.style.display = 'none';
                successMessage.innerHTML = `پرداخت با موفقیت انجام شد! <button class="btn dashboard-btn">ورود به داشبورد</button>`;
                successMessage.style.display = 'block';
            }, 2000); // شبیه‌سازی 2 ثانیه زمان پردازش
        }
    });

    // مدیریت دکمه ورود به داشبورد
    successMessage.addEventListener('click', (e) => {
        if (e.target.classList.contains('dashboard-btn')) {
            const code = document.querySelector('.company-code')?.textContent;
            if (code) {
                const dashboard = document.getElementById('dashboard');
                hideAllSections(dashboard);
                loadDashboard(code);
                document.getElementById('dashboard-link').style.display = 'inline';
                document.getElementById('logout-btn').style.display = 'inline';
                document.querySelectorAll('a[href^="#"]:not(#dashboard-link):not(#logout-btn)').forEach(link => {
                    link.style.display = 'none';
                });
                dashboard.scrollIntoView({ behavior: 'smooth' });
                successMessage.style.display = 'none';
                modal.style.display = 'none';
            }
        }
    });

    // بستن پاپ‌آپ درگاه با دکمه بازگشت
    closePaymentBtn.addEventListener('click', () => {
        paymentModal.style.display = 'none';
        loading.style.display = 'none';
        cardNumberError.style.display = 'none';
        expiryDateError.style.display = 'none';
        cvvError.style.display = 'none';
    });

    backBtn.addEventListener('click', () => {
        paymentModal.style.display = 'none';
        subscriptionCard.style.display = 'block';
        loading.style.display = 'none';
        cardNumberError.style.display = 'none';
        expiryDateError.style.display = 'none';
        cvvError.style.display = 'none';
    });

    // مدیریت دکمه خروج
    const logoutBtn = document.getElementById('logout-btn');
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const hero = document.querySelector('.hero');
        hideAllSections(hero);
        hero.scrollIntoView({ behavior: 'smooth' });

        // مدیریت لینک‌های ناوبری
        document.getElementById('dashboard-link').style.display = 'none';
        logoutBtn.style.display = 'none';
        document.querySelectorAll('a[href^="#"]:not(#dashboard-link):not(#logout-btn)').forEach(link => {
            link.style.display = 'inline';
        });
    });

    // تابع بارگذاری داشبورد
    function loadDashboard(code) {
        try {
            const companyData = JSON.parse(localStorage.getItem('companyData_' + code)) || {};
            const subscription = JSON.parse(localStorage.getItem('subscription_' + code)) || {};

            // پیام خوش‌آمدگویی پویا
            const welcomeMessage = document.getElementById('welcome-message');
            if (welcomeMessage) {
                welcomeMessage.textContent = `خوش آمدید، ${companyData.name || 'کاربر'}!`;
            }

            // پر کردن اطلاعات شرکت
            document.getElementById('dash-company-name').textContent = companyData.name || 'یافت نشد';
            document.getElementById('dash-company-code').textContent = companyData.code || 'نامشخص';
            document.getElementById('dash-company-field').textContent = companyData.field || 'نامشخص';
            document.getElementById('dash-company-address').textContent = companyData.address || 'نامشخص';
            document.getElementById('dash-company-tier').textContent = companyData.tier || 'نامشخص';
            if (subscription.active) {
                const expiryDate = new Date(subscription.expiry).toLocaleDateString('fa-IR');
                document.getElementById('dash-subscription-status').textContent = `فعال تا ${expiryDate}`;
            } else {
                document.getElementById('dash-subscription-status').textContent = 'غیرفعال';
            }

            // پر کردن اطلاعات اشتراک
            document.getElementById('dash-subscription-tier').textContent = subscription.tier || 'ندارد';
            document.getElementById('dash-subscription-expiry').textContent = subscription.expiry ? new Date(subscription.expiry).toLocaleDateString('fa-IR') : 'نامشخص';

            // مدیریت دکمه تمدید اشتراک
            const renewBtn = document.querySelector('.renew-subscription-btn');
            renewBtn.addEventListener('click', () => {
                const tier = document.querySelector('.company-tier').textContent;
                let price;
                switch (tier) {
                    case 'Tier 1':
                        price = '10,000,000';
                        break;
                    case 'Tier 2':
                        price = '5,000,000';
                        break;
                    case 'Tier 3':
                        price = '2,000,000';
                        break;
                    default:
                        price = 'نامشخص';
                }

                document.querySelector('.subscription-tier').textContent = tier;
                document.querySelector('.subscription-price').textContent = price;
                modal.style.display = 'flex';
                resultDiv.style.display = 'none';
                companyCard.style.display = 'none';
                subscriptionCard.style.display = 'block';
                paymentModal.style.display = 'none';
                successMessage.style.display = 'none';
                loading.style.display = 'none';
            });

            // بارگذاری اعلان‌ها
            loadNotifications(code, subscription);

            // بارگذاری همکاری‌ها
            loadCollaborations(code);
        } catch (error) {
            console.error('خطا در بارگذاری داشبورد:', error);
        }
    }

    // تابع بارگذاری اعلان‌ها
    function loadNotifications(code, subscription) {
        const notificationsList = document.getElementById('notifications-list');
        notificationsList.innerHTML = '';

        const notifications = [];
        if (subscription.active) {
            const expiryDate = new Date(subscription.expiry);
            const now = new Date();
            const daysLeft = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
            if (daysLeft <= 5) {
                notifications.push(`اشتراک شما تا ${daysLeft} روز دیگر به پایان می‌رسد!`);
            }
        } else {
            notifications.push('شما اشتراک فعالی ندارید. برای استفاده از امکانات، اشتراک تهیه کنید.');
        }
        notifications.push('یک پیشنهاد همکاری جدید از شرکت فناوری نوین دریافت کرده‌اید.');

        notifications.forEach((notification, index) => {
            const li = document.createElement('li');
            li.textContent = notification;
            notificationsList.appendChild(li);
            setTimeout(() => {
                li.classList.add('visible');
            }, index * 300);
        });
    }

    // تابع بارگذاری همکاری‌ها
    function loadCollaborations(code) {
        const tableBody = document.getElementById('collaboration-table-body');
        tableBody.innerHTML = '';

        // داده‌های فیک برای همکاری‌ها
        const collaborationData = JSON.parse(localStorage.getItem('collaborations_' + code)) || [
            {
                id: 1,
                partnerName: 'شرکت فناوری نوین',
                startDate: '1403/07/01',
                status: 'active',
                description: 'همکاری در زمینه توسعه نرم‌افزارهای مالی'
            },
            {
                id: 2,
                partnerName: 'شرکت آینده‌سازان',
                startDate: '1403/06/15',
                status: 'completed',
                description: 'پروژه مشترک در زمینه تولید صنعتی'
            },
            {
                id: 3,
                partnerName: 'شرکت نمونه ب',
                startDate: '1403/05/20',
                status: 'canceled',
                description: 'همکاری لغو شده به دلیل عدم توافق مالی'
            }
        ];

        // ذخیره داده‌ها در localStorage
        localStorage.setItem('collaborations_' + code, JSON.stringify(collaborationData));

        // پر کردن جدول
        collaborationData.forEach(collab => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${collab.partnerName}</td>
                <td>${collab.startDate}</td>
                <td><span class="status ${collab.status}">${
                    collab.status === 'active' ? 'فعال' :
                    collab.status === 'completed' ? 'تکمیل‌شده' :
                    'لغو‌شده'
                }</span></td>
                <td><button class="btn details-btn" data-id="${collab.id}">جزئیات</button></td>
                <td>
                    ${
                        collab.status === 'canceled'
                        ? `<button class="btn activate-btn" data-id="${collab.id}">فعال کردن</button>`
                        : `<button class="btn cancel-btn" data-id="${collab.id}" ${
                            collab.status !== 'active' ? 'disabled' : ''
                        }>لغو همکاری</button>`
                    }
                </td>
            `;
            tableBody.appendChild(row);
        });

        // مدیریت جستجو و فیلتر
        const searchInput = document.getElementById('collaboration-search');
        const filterSelect = document.getElementById('collaboration-filter');

        function filterCollaborations() {
            const searchTerm = searchInput.value.toLowerCase();
            const filterStatus = filterSelect.value;

            const filteredData = collaborationData.filter(collab => {
                const matchesSearch = collab.partnerName.toLowerCase().includes(searchTerm);
                const matchesFilter = filterStatus === 'all' || collab.status === filterStatus;
                return matchesSearch && matchesFilter;
            });

            tableBody.innerHTML = '';
            filteredData.forEach(collab => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${collab.partnerName}</td>
                    <td>${collab.startDate}</td>
                    <td><span class="status ${collab.status}">${
                        collab.status === 'active' ? 'فعال' :
                        collab.status === 'completed' ? 'تکمیل‌شده' :
                        'لغو‌شده'
                    }</span></td>
                    <td><button class="btn details-btn" data-id="${collab.id}">جزئیات</button></td>
                    <td>
                        ${
                            collab.status === 'canceled'
                            ? `<button class="btn activate-btn" data-id="${collab.id}">فعال کردن</button>`
                            : `<button class="btn cancel-btn" data-id="${collab.id}" ${
                                collab.status !== 'active' ? 'disabled' : ''
                            }>لغو همکاری</button>`
                        }
                    </td>
                `;
                tableBody.appendChild(row);
            });

            // اضافه کردن رویداد به دکمه‌های جدید
            addCollaborationEventListeners();
        }

        searchInput.addEventListener('input', filterCollaborations);
        filterSelect.addEventListener('change', filterCollaborations);

        // اضافه کردن رویداد به دکمه‌ها
        addCollaborationEventListeners();
    }

    // تابع اضافه کردن رویداد به دکمه‌های همکاری
    function addCollaborationEventListeners() {
        // مدیریت دکمه جزئیات
        document.querySelectorAll('.details-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const collabId = btn.getAttribute('data-id');
                const code = document.querySelector('.company-code')?.textContent;
                const collaborationData = JSON.parse(localStorage.getItem('collaborations_' + code)) || [];
                const collab = collaborationData.find(c => c.id == collabId);

                if (collab) {
                    document.getElementById('detail-partner-name').textContent = collab.partnerName;
                    document.getElementById('detail-start-date').textContent = collab.startDate;
                    document.getElementById('detail-status').textContent = 
                        collab.status === 'active' ? 'فعال' :
                        collab.status === 'completed' ? 'تکمیل‌شده' :
                        'لغو‌شده';
                    document.getElementById('detail-description').textContent = collab.description;
                    document.getElementById('collaboration-details-modal').style.display = 'flex';
                }
            });
        });

        // مدیریت دکمه لغو همکاری
        document.querySelectorAll('.cancel-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const collabId = btn.getAttribute('data-id');
                const code = document.querySelector('.company-code')?.textContent;
                let collaborationData = JSON.parse(localStorage.getItem('collaborations_' + code)) || [];
                const collabIndex = collaborationData.findIndex(c => c.id == collabId);

                if (collabIndex !== -1) {
                    collaborationData[collabIndex].status = 'canceled';
                    localStorage.setItem('collaborations_' + code, JSON.stringify(collaborationData));
                    loadCollaborations(code);

                    // اضافه کردن اعلان
                    const notificationsList = document.getElementById('notifications-list');
                    const li = document.createElement('li');
                    li.textContent = `همکاری با ${collaborationData[collabIndex].partnerName} لغو شد.`;
                    notificationsList.insertBefore(li, notificationsList.firstChild);
                    setTimeout(() => {
                        li.classList.add('visible');
                    }, 100);
                }
            });
        });

        // مدیریت دکمه فعال کردن همکاری
        document.querySelectorAll('.activate-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const collabId = btn.getAttribute('data-id');
                const code = document.querySelector('.company-code')?.textContent;
                let collaborationData = JSON.parse(localStorage.getItem('collaborations_' + code)) || [];
                const collabIndex = collaborationData.findIndex(c => c.id == collabId);

                if (collabIndex !== -1) {
                    collaborationData[collabIndex].status = 'active';
                    localStorage.setItem('collaborations_' + code, JSON.stringify(collaborationData));
                    loadCollaborations(code);

                    // اضافه کردن اعلان
                    const notificationsList = document.getElementById('notifications-list');
                    const li = document.createElement('li');
                    li.textContent = `همکاری با ${collaborationData[collabIndex].partnerName} دوباره فعال شد.`;
                    notificationsList.insertBefore(li, notificationsList.firstChild);
                    setTimeout(() => {
                        li.classList.add('visible');
                    }, 100);
                }
            });
        });

        // مدیریت دکمه بستن مودال جزئیات همکاری
        const collaborationCloseBtn = document.querySelector('.collaboration-close-btn');
        if (collaborationCloseBtn) {
            collaborationCloseBtn.addEventListener('click', () => {
                document.getElementById('collaboration-details-modal').style.display = 'none';
            });
        }

        // بستن مودال جزئیات همکاری با کلیک روی پس‌زمینه
        const collaborationModal = document.getElementById('collaboration-details-modal');
        window.addEventListener('click', (e) => {
            if (e.target === collaborationModal) {
                collaborationModal.style.display = 'none';
            }
        });
    }
});