document.addEventListener('DOMContentLoaded', () => {
    // تابع برای غیرفعال کردن اسکرول صفحه
    function disableBodyScroll() {
        document.body.style.overflow = 'hidden';
        document.body.style.height = '100vh';
    }

    // تابع برای فعال کردن اسکرول صفحه
    function enableBodyScroll() {
        document.body.style.overflow = '';
        document.body.style.height = '';
    }

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

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // بستن منو هنگام کلیک روی لینک‌ها در موبایل
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 600) {
                    hamburger.classList.remove('active');
                    navLinks.classList.remove('active');
                }
            });
        });
    }

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

    // انیمیشن برای لیست‌ها (پیشنهادات و درخواست‌ها)
    function animateListItems(listId) {
        const listItems = document.querySelectorAll(`#${listId} li`);
        listItems.forEach((item, index) => {
            if (!item.classList.contains('visible')) {
                setTimeout(() => {
                    item.classList.add('visible');
                }, index * 200);
            }
        });
    }

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
        disableBodyScroll(); // غیرفعال کردن اسکرول صفحه
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
        enableBodyScroll(); // فعال کردن اسکرول صفحه
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
            enableBodyScroll(); // فعال کردن اسکرول صفحه
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
                const strengths = ["تخصص در فناوری اطلاعات", "تیم قوی", "سابقه طولانی"];
                const weaknesses = ["محدودیت مالی", "عدم تجربه بین‌المللی", "تیم کوچک"];

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
                        tier: tiers[randomIndex],
                        strengths: strengths[randomIndex],
                        weaknesses: weaknesses[randomIndex]
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
        disableBodyScroll(); // غیرفعال کردن اسکرول صفحه
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
                enableBodyScroll(); // فعال کردن اسکرول صفحه
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
                enableBodyScroll(); // فعال کردن اسکرول صفحه
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
        enableBodyScroll(); // فعال کردن اسکرول صفحه
    });

    backBtn.addEventListener('click', () => {
        paymentModal.style.display = 'none';
        subscriptionCard.style.display = 'block';
        loading.style.display = 'none';
        cardNumberError.style.display = 'none';
        expiryDateError.style.display = 'none';
        cvvError.style.display = 'none';
        enableBodyScroll(); // فعال کردن اسکرول صفحه
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

    // تابع پیشنهاد شرکای مناسب
    function suggestCollaborations(code) {
        const companyData = JSON.parse(localStorage.getItem('companyData_' + code)) || {};
        const allCompanies = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('companyData_') && key !== 'companyData_' + code) {
                const otherCompany = JSON.parse(localStorage.getItem(key));
                allCompanies.push(otherCompany);
            }
        }

        // پیشنهاد شرکت‌هایی که زمینه فعالیت مشابه دارن
        const suggestions = allCompanies.filter(company => company.field === companyData.field);
        return suggestions.map(company => ({
            name: company.name,
            code: company.code,
            field: company.field,
            strengths: company.strengths,
            weaknesses: company.weaknesses
        }));
    }

    // تابع ارسال درخواست همکاری
    function sendCollaborationRequest(senderCode, receiverCode) {
        const senderData = JSON.parse(localStorage.getItem('companyData_' + senderCode));
        const receiverData = JSON.parse(localStorage.getItem('companyData_' + receiverCode));
        const request = {
            id: Date.now(),
            senderCode: senderCode,
            senderName: senderData.name,
            receiverCode: receiverCode,
            receiverName: receiverData.name,
            status: 'pending',
            date: new Date().toLocaleDateString('fa-IR')
        };

        // ذخیره درخواست
        const requests = JSON.parse(localStorage.getItem('collaborationRequests')) || [];
        requests.push(request);
        localStorage.setItem('collaborationRequests', JSON.stringify(requests));

        // اضافه کردن اعلان برای شرکت فرستنده
        const notificationsList = document.getElementById('notifications-list');
        const li = document.createElement('li');
        li.textContent = `درخواست همکاری برای ${receiverData.name} ارسال شد.`;
        notificationsList.insertBefore(li, notificationsList.firstChild);
        setTimeout(() => {
            li.classList.add('visible');
        }, 100);

        // شبیه‌سازی پاسخ خودکار (برای تست)
        setTimeout(() => {
            const updatedRequests = JSON.parse(localStorage.getItem('collaborationRequests')) || [];
            const requestIndex = updatedRequests.findIndex(r => r.id === request.id);
            if (requestIndex !== -1) {
                const randomResponse = Math.random() > 0.5 ? 'accepted' : 'rejected';
                updatedRequests[requestIndex].status = randomResponse;
                localStorage.setItem('collaborationRequests', JSON.stringify(updatedRequests));

                // اضافه کردن اعلان برای شرکت فرستنده
                const statusText = randomResponse === 'accepted' ? 'پذیرفته شد' : 'رد شد';
                const notificationLi = document.createElement('li');
                notificationLi.textContent = `درخواست همکاری با ${receiverData.name} ${statusText}.`;
                notificationsList.insertBefore(notificationLi, notificationsList.firstChild);
                setTimeout(() => {
                    notificationLi.classList.add('visible');
                }, 100);

                // اگر درخواست پذیرفته شد، همکاری رو به لیست همکاری‌ها اضافه کن
                if (randomResponse === 'accepted') {
                    const collaboration = {
                        id: request.id,
                        partnerName: receiverData.name,
                        partnerCode: receiverCode,
                        startDate: new Date().toLocaleDateString('fa-IR'),
                        status: 'active',
                        description: `همکاری با ${receiverData.name} در زمینه ${receiverData.field}`
                    };
                    const collaborations = JSON.parse(localStorage.getItem('collaborations_' + senderCode)) || [];
                    collaborations.push(collaboration);
                    localStorage.setItem('collaborations_' + senderCode, JSON.stringify(collaborations));

                    // اضافه کردن همکاری به شرکت مقابل
                    const partnerCollaborations = JSON.parse(localStorage.getItem('collaborations_' + receiverCode)) || [];
                    partnerCollaborations.push({
                        id: request.id,
                        partnerName: senderData.name,
                        partnerCode: senderCode,
                        startDate: new Date().toLocaleDateString('fa-IR'),
                        status: 'active',
                        description: `همکاری با ${senderData.name} در زمینه ${senderData.field}`
                    });
                    localStorage.setItem('collaborations_' + receiverCode, JSON.stringify(partnerCollaborations));
                }
            }
        }, 3000); // شبیه‌سازی پاسخ بعد از 3 ثانیه
    }

    // تابع بارگذاری داشبورد
    function loadDashboard(code) {
        const companyData = JSON.parse(localStorage.getItem('companyData_' + code));
        const subscription = JSON.parse(localStorage.getItem('subscription_' + code));

        if (companyData) {
            document.getElementById('welcome-message').textContent = `خوش آمدید، ${companyData.name}`;
            document.getElementById('dash-company-name').textContent = companyData.name;
            document.getElementById('dash-company-code').textContent = companyData.code;
            document.getElementById('dash-company-field').textContent = companyData.field;
            document.getElementById('dash-company-address').textContent = companyData.address;
            document.getElementById('dash-company-tier').textContent = companyData.tier;
        }

        if (subscription && subscription.active) {
            const expiryDate = new Date(subscription.expiry).toLocaleDateString('fa-IR');
            document.getElementById('dash-subscription-status').textContent = `فعال تا ${expiryDate}`;
            document.getElementById('dash-subscription-tier').textContent = subscription.tier;
            document.getElementById('dash-subscription-expiry').textContent = expiryDate;
        } else {
            document.getElementById('dash-subscription-status').textContent = 'غیرفعال';
            document.getElementById('dash-subscription-tier').textContent = 'ندارد';
            document.getElementById('dash-subscription-expiry').textContent = 'ندارد';
        }

        // بارگذاری اعلان‌ها
        const notificationsList = document.getElementById('notifications-list');
        notificationsList.innerHTML = '';
        const notifications = JSON.parse(localStorage.getItem('notifications_' + code)) || [];
        notifications.forEach(notification => {
            const li = document.createElement('li');
            li.textContent = notification;
            notificationsList.appendChild(li);
        });
        animateListItems('notifications-list');

        // بارگذاری پیشنهادات همکاری
        const suggestionsList = document.getElementById('suggestions-list');
        suggestionsList.innerHTML = '';
        const suggestions = suggestCollaborations(code);
        suggestions.forEach(suggestion => {
            const li = document.createElement('li');
            li.innerHTML = `${suggestion.name} (${suggestion.field}) - نقاط قوت: ${suggestion.strengths} | نقاط ضعف: ${suggestion.weaknesses} <button class="btn request-btn" data-code="${suggestion.code}">درخواست همکاری</button>`;
            suggestionsList.appendChild(li);
        });
        animateListItems('suggestions-list');

        // مدیریت دکمه‌های درخواست همکاری
        document.querySelectorAll('.request-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const receiverCode = btn.getAttribute('data-code');
                sendCollaborationRequest(code, receiverCode);
            });
        });

        // بارگذاری درخواست‌های همکاری
        const requestsList = document.getElementById('requests-list');
        requestsList.innerHTML = '';
        const requests = JSON.parse(localStorage.getItem('collaborationRequests')) || [];
        const myRequests = requests.filter(r => r.senderCode === code || r.receiverCode === code);
        myRequests.forEach(request => {
            const li = document.createElement('li');
            const statusText = request.status === 'pending' ? 'در انتظار' : request.status === 'accepted' ? 'پذیرفته‌شده' : 'رد‌شده';
            li.textContent = `درخواست با ${request.senderCode === code ? request.receiverName : request.senderName} - وضعیت: ${statusText} (${request.date})`;
            requestsList.appendChild(li);
        });
        animateListItems('requests-list');

        // بارگذاری همکاری‌های فعال
        loadCollaborations(code);
    }

    // تابع بارگذاری همکاری‌ها
    function loadCollaborations(code) {
        const tableBody = document.getElementById('collaboration-table-body');
        tableBody.innerHTML = '';
        const collaborationData = JSON.parse(localStorage.getItem('collaborations_' + code)) || [];

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
                <td>${
                    collab.status === 'active' ?
                    `<button class="btn complete-btn" data-id="${collab.id}">تکمیل</button>
                     <button class="btn cancel-btn" data-id="${collab.id}">لغو</button>` :
                    collab.status === 'canceled' ?
                    `<button class="btn activate-btn" data-id="${collab.id}">فعال‌سازی مجدد</button>` :
                    ''
                }</td>
            `;
            tableBody.appendChild(row);
        });

        // اضافه کردن فیلتر و جستجو
        addCollaborationEventListeners(code);
    }

    // تابع اضافه کردن رویدادها برای همکاری‌ها
    function addCollaborationEventListeners(code) {
        const searchInput = document.getElementById('collaboration-search');
        const filterSelect = document.getElementById('collaboration-filter');
        const tableBody = document.getElementById('collaboration-table-body');
        const collaborationData = JSON.parse(localStorage.getItem('collaborations_' + code)) || [];

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
                    <td>${
                        collab.status === 'active' ?
                        `<button class="btn complete-btn" data-id="${collab.id}">تکمیل</button>
                         <button class="btn cancel-btn" data-id="${collab.id}">لغو</button>` :
                        collab.status === 'canceled' ?
                        `<button class="btn activate-btn" data-id="${collab.id}">فعال‌سازی مجدد</button>` :
                        ''
                    }</td>
                `;
                tableBody.appendChild(row);
            });

            // دوباره رویدادها رو برای دکمه‌های جدید اضافه کن
            addButtonEventListeners();
        }

        searchInput.addEventListener('input', filterCollaborations);
        filterSelect.addEventListener('change', filterCollaborations);

        // مدیریت دکمه‌های جزئیات، تکمیل، لغو و فعال‌سازی مجدد
        function addButtonEventListeners() {
            // دکمه جزئیات
            document.querySelectorAll('.details-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const collabId = btn.getAttribute('data-id');
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
                        disableBodyScroll(); // غیرفعال کردن اسکرول صفحه

                        // بارگذاری پیام‌ها
                        const messagesList = document.getElementById('negotiation-messages');
                        messagesList.innerHTML = '';
                        const messages = JSON.parse(localStorage.getItem(`messages_${collabId}`)) || [];
                        messages.forEach(msg => {
                            const li = document.createElement('li');
                            li.textContent = `${msg.sender}: ${msg.text} (${msg.date})`;
                            messagesList.appendChild(li);
                        });
                    }
                });
            });

            // دکمه تکمیل
            document.querySelectorAll('.complete-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const collabId = btn.getAttribute('data-id');
                    const collaborationData = JSON.parse(localStorage.getItem('collaborations_' + code)) || [];
                    const collabIndex = collaborationData.findIndex(c => c.id == collabId);
                    if (collabIndex !== -1) {
                        collaborationData[collabIndex].status = 'completed';
                        localStorage.setItem('collaborations_' + code, JSON.stringify(collaborationData));
                        loadCollaborations(code);
                    }
                });
            });

            // دکمه لغو
            document.querySelectorAll('.cancel-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const collabId = btn.getAttribute('data-id');
                    const collaborationData = JSON.parse(localStorage.getItem('collaborations_' + code)) || [];
                    const collabIndex = collaborationData.findIndex(c => c.id == collabId);
                    if (collabIndex !== -1) {
                        collaborationData[collabIndex].status = 'canceled';
                        localStorage.setItem('collaborations_' + code, JSON.stringify(collaborationData));
                        loadCollaborations(code);
                    }
                });
            });

            // دکمه فعال‌سازی مجدد
            document.querySelectorAll('.activate-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const collabId = btn.getAttribute('data-id');
                    const collaborationData = JSON.parse(localStorage.getItem('collaborations_' + code)) || [];
                    const collabIndex = collaborationData.findIndex(c => c.id == collabId);
                    if (collabIndex !== -1) {
                        collaborationData[collabIndex].status = 'active';
                        localStorage.setItem('collaborations_' + code, JSON.stringify(collaborationData));
                        loadCollaborations(code);
                    }
                });
            });
        }

        addButtonEventListeners();
    }

    // مدیریت مودال جزئیات همکاری
    const closeCollabBtn = document.querySelector('.collaboration-close-btn');
    closeCollabBtn.addEventListener('click', () => {
        document.getElementById('collaboration-details-modal').style.display = 'none';
        enableBodyScroll(); // فعال کردن اسکرول صفحه
    });

    window.addEventListener('click', (e) => {
        if (e.target === document.getElementById('collaboration-details-modal')) {
            document.getElementById('collaboration-details-modal').style.display = 'none';
            enableBodyScroll(); // فعال کردن اسکرول صفحه
        }
    });

    // مدیریت فرم مذاکره
    const negotiationForm = document.querySelector('.negotiation-form');
    negotiationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const messageText = document.getElementById('negotiation-message').value;
        const messagesList = document.getElementById('negotiation-messages');
        const collabId = document.querySelector('.details-btn')?.getAttribute('data-id');

        if (messageText && collabId) {
            const message = {
                sender: JSON.parse(localStorage.getItem('companyData_' + document.querySelector('.company-code')?.textContent))?.name,
                text: messageText,
                date: new Date().toLocaleString('fa-IR')
            };
            const messages = JSON.parse(localStorage.getItem(`messages_${collabId}`)) || [];
            messages.push(message);
            localStorage.setItem(`messages_${collabId}`, JSON.stringify(messages));

            const li = document.createElement('li');
            li.textContent = `${message.sender}: ${message.text} (${message.date})`;
            messagesList.appendChild(li);
            negotiationForm.reset();
        }
    });

    // مدیریت فرم نگارش تفاهم‌نامه
    const agreementForm = document.querySelector('.agreement-form');
    agreementForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const agreementText = document.getElementById('agreement-text').value;
        const agreementStatus = document.getElementById('agreement-status');

        if (agreementText) {
            const collabId = document.querySelector('.details-btn')?.getAttribute('data-id');
            localStorage.setItem(`agreement_${collabId}`, agreementText);
            agreementStatus.textContent = 'تفاهم‌نامه با موفقیت ذخیره و امضا شد.';
            agreementStatus.style.display = 'block';
            agreementForm.reset();
        }
    });

    // مدیریت فرم گزارش تخلف
    const reportForm = document.querySelector('.report-form');
    reportForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const reportText = document.getElementById('report-text').value;
        const reportStatus = document.getElementById('report-status');

        if (reportText) {
            const collabId = document.querySelector('.details-btn')?.getAttribute('data-id');
            const report = {
                collabId: collabId,
                text: reportText,
                date: new Date().toLocaleString('fa-IR')
            };
            const reports = JSON.parse(localStorage.getItem('reports')) || [];
            reports.push(report);
            localStorage.setItem('reports', JSON.stringify(reports));

            reportStatus.textContent = 'گزارش تخلف با موفقیت ارسال شد.';
            reportStatus.style.display = 'block';
            reportForm.reset();
        }
    });

    // مدیریت فرم پیشنهادات مردمی
    const publicSuggestionForm = document.querySelector('.public-suggestion-form');
    publicSuggestionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const company1Code = document.getElementById('company1-code').value;
        const company2Code = document.getElementById('company2-code').value;
        const suggestionText = document.getElementById('suggestion-text').value;
        const suggestionStatus = document.getElementById('suggestion-status');

        const codeRegex = /^[0-9]{6}$/;
        if (!codeRegex.test(company1Code) || !codeRegex.test(company2Code)) {
            suggestionStatus.textContent = 'کد شرکت‌ها باید 6 رقمی و فقط عدد باشد!';
            suggestionStatus.style.color = '#FF5555';
            suggestionStatus.style.display = 'block';
            return;
        }

        if (company1Code === company2Code) {
            suggestionStatus.textContent = 'کد شرکت‌ها نمی‌تواند یکسان باشد!';
            suggestionStatus.style.color = '#FF5555';
            suggestionStatus.style.display = 'block';
            return;
        }

        const suggestion = {
            company1Code,
            company2Code,
            suggestionText,
            date: new Date().toLocaleString('fa-IR')
        };
        const suggestions = JSON.parse(localStorage.getItem('publicSuggestions')) || [];
        suggestions.push(suggestion);
        localStorage.setItem('publicSuggestions', JSON.stringify(suggestions));

        suggestionStatus.textContent = 'پیشنهاد شما با موفقیت ثبت شد.';
        suggestionStatus.style.color = '#00FF99';
        suggestionStatus.style.display = 'block';
        publicSuggestionForm.reset();
    });

    // مدیریت دکمه تمدید اشتراک
    const renewSubscriptionBtn = document.querySelector('.renew-subscription-btn');
    renewSubscriptionBtn.addEventListener('click', () => {
        const code = document.querySelector('.company-code')?.textContent;
        if (code) {
            const modal = document.getElementById('check-modal');
            modal.style.display = 'flex';
            document.querySelector('.result').style.display = 'none';
            document.querySelector('#company-code').value = code;
            disableBodyScroll(); // غیرفعال کردن اسکرول صفحه
        }
    });
});