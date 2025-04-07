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
            } else if (targetId === 'contact') {
                const contactSection = document.getElementById('contact');
                hideAllSections(contactSection);
                contactSection.scrollIntoView({ behavior: 'smooth' });
            } else if (targetId === 'dashboard') {
                hideAllSections(dashboard);
                dashboard.scrollIntoView({ behavior: 'smooth' });
                document.getElementById('dashboard-link').style.display = 'inline';
                document.getElementById('logout-btn').style.display = 'inline';
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
    const sectionsToAnimate = ['features', 'future', 'dashboard'];
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

    startBtn.addEventListener('click', () => {
        modal.style.display = 'flex';
        resultDiv.style.display = 'none';
        companyCodeError.style.display = 'none';
        disableBodyScroll();
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        resultDiv.style.display = 'none';
        subscriptionCard.style.display = 'none';
        paymentModal.style.display = 'none';
        successMessage.style.display = 'none';
        loading.style.display = 'none';
        companyCodeError.style.display = 'none';
        enableBodyScroll();
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            resultDiv.style.display = 'none';
            subscriptionCard.style.display = 'none';
            paymentModal.style.display = 'none';
            successMessage.style.display = 'none';
            loading.style.display = 'none';
            companyCodeError.style.display = 'none';
            enableBodyScroll();
        }
    });

    companyCodeInput.addEventListener('input', () => {
        const value = companyCodeInput.value;
        const regex = /^[0-9]*$/;
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

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const code = companyCodeInput.value;
        const regex = /^[0-9]{6}$/;
        if (regex.test(code)) {
            const savedCompany = JSON.parse(localStorage.getItem('companyData_' + code));
            if (savedCompany) {
                document.querySelector('.company-name').textContent = savedCompany.name;
                document.querySelector('.company-code').textContent = savedCompany.code;
                document.querySelector('.company-date').textContent = savedCompany.date;
                document.querySelector('.company-address').textContent = savedCompany.address;
                document.querySelector('.company-status').textContent = savedCompany.status;
                document.querySelector('.company-field').textContent = savedCompany.field;
                document.querySelector('.company-tier').textContent = savedCompany.tier;

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
                const companyNames = ["شرکت نمونه الف", "شرکت فناوری نوین", "شرکت آینده‌سازان"];
                const dates = ["1398/05/12", "1400/03/20", "1395/11/30"];
                const addresses = ["تهران، خیابان آزادی", "اصفهان، بلوار ملت", "شیراز، خیابان کریم‌خان"];
                const statuses = ["فعال", "غیرفعال", "در حال ثبت"];
                const fields = ["فناوری اطلاعات", "تولید صنعتی", "خدمات مالی"];
                const tiers = ["Tier 1", "Tier 2", "Tier 3"];
                const strengths = ["تخصص در فناوری اطلاعات", "تیم قوی", "سابقه طولانی"];
                const weaknesses = ["محدودیت مالی", "عدم تجربه بین‌المللی", "تیم کوچک"];

                const randomIndex = Math.floor(Math.random() * 3);
                const isFound = Math.random() > 0.2;

                if (isFound) {
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

                    localStorage.setItem('companyData_' + code, JSON.stringify(companyData));

                    document.querySelector('.company-name').textContent = companyData.name;
                    document.querySelector('.company-code').textContent = companyData.code;
                    document.querySelector('.company-date').textContent = companyData.date;
                    document.querySelector('.company-address').textContent = companyData.address;
                    document.querySelector('.company-status').textContent = companyData.status;
                    document.querySelector('.company-field').textContent = companyData.field;
                    document.querySelector('.company-tier').textContent = companyData.tier;

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

    document.querySelector('.pay-btn').addEventListener('click', () => {
        subscriptionCard.style.display = 'none';
        paymentModal.style.display = 'flex';
        successMessage.style.display = 'none';
        loading.style.display = 'none';
        disableBodyScroll();
    });

    const paymentForm = document.querySelector('.payment-form');
    const closePaymentBtn = document.querySelector('.close-payment-btn');
    const backBtn = document.querySelector('.back-btn');
    const cardNumberInput = document.querySelector('#card-number');
    const expiryDateInput = document.querySelector('#expiry-date');
    const cvvInput = document.querySelector('#cvv');
    const cardNumberError = document.querySelector('#card-number-error');
    const expiryDateError = document.querySelector('#expiry-date-error');
    const cvvError = document.querySelector('#cvv-error');

    cardNumberInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/(\d{4})/g, '$1 ').trim();
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

    expiryDateInput.addEventListener('input', () => {
        const value = expiryDateInput.value;
        const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
        if (!regex.test(value)) {
            expiryDateError.textContent = 'تاریخ انقضا باید به فرمت MM/YY باشد!';
            expiryDateError.style.display = 'block';
        } else {
            expiryDateError.style.display = 'none';
        }
    });

    cvvInput.addEventListener('input', () => {
        const value = cvvInput.value;
        const regex = /^[0-9]{3,4}$/;
        if (!regex.test(value)) {
            cvvError.textContent = 'CVV باید 3 یا 4 رقم باشد!';
            cvvError.style.display = 'block';
        } else {
            cvvError.style.display = 'none';
        }
    });

    paymentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const cardNumber = cardNumberInput.value.replace(/\s/g, '');
        const expiryDate = expiryDateInput.value;
        const cvv = cvvInput.value;

        const cardNumberRegex = /^[0-9]{16}$/;
        const expiryDateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
        const cvvRegex = /^[0-9]{3,4}$/;

        let isValid = true;

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
            loading.style.display = 'block';
            setTimeout(() => {
                const code = document.querySelector('.company-code').textContent;
                const tier = document.querySelector('.company-tier').textContent;
                const expiryDate = new Date();
                expiryDate.setMonth(expiryDate.getMonth() + 1);
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
                enableBodyScroll();
            }, 2000);
        }
    });

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
                enableBodyScroll();
            }
        }
    });

    closePaymentBtn.addEventListener('click', () => {
        paymentModal.style.display = 'none';
        loading.style.display = 'none';
        cardNumberError.style.display = 'none';
        expiryDateError.style.display = 'none';
        cvvError.style.display = 'none';
        enableBodyScroll();
    });

    backBtn.addEventListener('click', () => {
        paymentModal.style.display = 'none';
        subscriptionCard.style.display = 'block';
        loading.style.display = 'none';
        cardNumberError.style.display = 'none';
        expiryDateError.style.display = 'none';
        cvvError.style.display = 'none';
        enableBodyScroll();
    });

    const logoutBtn = document.getElementById('logout-btn');
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const hero = document.querySelector('.hero');
        hideAllSections(hero);
        hero.scrollIntoView({ behavior: 'smooth' });

        document.getElementById('dashboard-link').style.display = 'none';
        logoutBtn.style.display = 'none';
        document.querySelectorAll('a[href^="#"]:not(#dashboard-link):not(#logout-btn)').forEach(link => {
            link.style.display = 'inline';
        });
    });

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

        const suggestions = allCompanies.filter(company => company.field === companyData.field);
        return suggestions.map(company => ({
            name: company.name,
            code: company.code,
            field: company.field,
            strengths: company.strengths,
            weaknesses: company.weaknesses
        }));
    }

    function sendCollaborationRequest(senderCode, receiverCode) {
        const senderData = JSON.parse(localStorage.getItem('companyData_' + senderCode));
        const receiverData = JSON.parse(localStorage.getItem('companyData_' + receiverCode));
        if (!senderData || !receiverData) {
            console.error('داده‌های شرکت فرستنده یا گیرنده یافت نشد.');
            return;
        }

        const request = {
            id: Date.now(),
            senderCode: senderCode,
            senderName: senderData.name,
            receiverCode: receiverCode,
            receiverName: receiverData.name,
            status: 'pending',
            date: new Date().toLocaleDateString('fa-IR')
        };

        const requests = JSON.parse(localStorage.getItem('collaborationRequests')) || [];
        requests.push(request);
        localStorage.setItem('collaborationRequests', JSON.stringify(requests));

        const notificationsList = document.getElementById('notifications-list');
        const li = document.createElement('li');
        li.textContent = `درخواست همکاری برای ${receiverData.name} ارسال شد.`;
        notificationsList.insertBefore(li, notificationsList.firstChild);
        setTimeout(() => {
            li.classList.add('visible');
        }, 100);

        loadRequests(senderCode);

        setTimeout(() => {
            const updatedRequests = JSON.parse(localStorage.getItem('collaborationRequests')) || [];
            const requestIndex = updatedRequests.findIndex(r => r.id === request.id);
            if (requestIndex !== -1) {
                const randomResponse = Math.random() > 0.5 ? 'accepted' : 'rejected';
                updatedRequests[requestIndex].status = randomResponse;
                localStorage.setItem('collaborationRequests', JSON.stringify(updatedRequests));

                const statusText = randomResponse === 'accepted' ? 'پذیرفته شد' : 'رد شد';
                const notificationLi = document.createElement('li');
                notificationLi.textContent = `درخواست همکاری با ${receiverData.name} ${statusText}.`;
                notificationsList.insertBefore(notificationLi, notificationsList.firstChild);
                setTimeout(() => {
                    notificationLi.classList.add('visible');
                }, 100);

                if (randomResponse === 'accepted') {
                    const collaboration = {
                        id: request.id,
                        partnerCode: receiverCode,
                        partnerName: receiverData.name,
                        startDate: new Date().toLocaleDateString('fa-IR'),
                        status: 'active',
                        description: `همکاری با ${receiverData.name} در زمینه ${receiverData.field}`
                    };

                    const partnerCollaboration = {
                        id: request.id,
                        partnerCode: senderCode,
                        partnerName: senderData.name,
                        startDate: new Date().toLocaleDateString('fa-IR'),
                        status: 'active',
                        description: `همکاری با ${senderData.name} در زمینه ${senderData.field}`
                    };

                    const senderCollaborations = JSON.parse(localStorage.getItem(`collaborations_${senderCode}`)) || [];
                    senderCollaborations.push(collaboration);
                    localStorage.setItem(`collaborations_${senderCode}`, JSON.stringify(senderCollaborations));

                    const receiverCollaborations = JSON.parse(localStorage.getItem(`collaborations_${receiverCode}`)) || [];
                    receiverCollaborations.push(partnerCollaboration);
                    localStorage.setItem(`collaborations_${receiverCode}`, JSON.stringify(receiverCollaborations));

                    loadCollaborations(senderCode);

                    const currentCompanyCode = document.querySelector('.company-code')?.textContent;
                    if (currentCompanyCode === receiverCode) {
                        loadCollaborations(receiverCode);
                    }
                }

                loadRequests(senderCode);
            }
        }, 3000);
    }

    function loadRequests(code) {
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
    }

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

        const notificationsList = document.getElementById('notifications-list');
        notificationsList.innerHTML = '';
        const notifications = JSON.parse(localStorage.getItem('notifications_' + code)) || [];
        notifications.forEach(notification => {
            const li = document.createElement('li');
            li.textContent = notification;
            notificationsList.appendChild(li);
        });
        animateListItems('notifications-list');

        const suggestionsList = document.getElementById('suggestions-list');
        suggestionsList.innerHTML = '';
        const suggestions = suggestCollaborations(code);
        suggestions.forEach(suggestion => {
            const li = document.createElement('li');
            li.innerHTML = `${suggestion.name} (${suggestion.field}) - نقاط قوت: ${suggestion.strengths} | نقاط ضعف: ${suggestion.weaknesses} <button class="btn request-btn" data-code="${suggestion.code}">درخواست همکاری</button>`;
            suggestionsList.appendChild(li);
        });
        animateListItems('suggestions-list');

        document.querySelectorAll('.request-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const receiverCode = btn.getAttribute('data-code');
                sendCollaborationRequest(code, receiverCode);
            });
        });

        loadRequests(code);
        loadCollaborations(code);
        loadSmartSuggestions(code);
    }

    function loadCollaborations(code) {
        const tableBody = document.getElementById('collaboration-table-body');
        if (!tableBody) {
            console.error('جدول همکاری‌ها یافت نشد.');
            return;
        }

        tableBody.innerHTML = '';
        const collaborationData = JSON.parse(localStorage.getItem(`collaborations_${code}`)) || [];

        if (collaborationData.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="5">هیچ همکاری فعالی یافت نشد.</td>`;
            tableBody.appendChild(row);
            return;
        }

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

        addCollaborationEventListeners(code);
    }

    function addCollaborationEventListeners(code) {
        const searchInput = document.getElementById('collaboration-search');
        const filterSelect = document.getElementById('collaboration-filter');
        const tableBody = document.getElementById('collaboration-table-body');
        const collaborationData = JSON.parse(localStorage.getItem(`collaborations_${code}`)) || [];

        function filterCollaborations() {
            const searchTerm = searchInput.value.toLowerCase();
            const filterStatus = filterSelect.value;

            const filteredData = collaborationData.filter(collab => {
                const matchesSearch = collab.partnerName.toLowerCase().includes(searchTerm);
                const matchesFilter = filterStatus === 'all' || collab.status === filterStatus;
                return matchesSearch && matchesFilter;
            });

            tableBody.innerHTML = '';
            if (filteredData.length === 0) {
                const row = document.createElement('tr');
                row.innerHTML = `<td colspan="5">هیچ همکاری‌ای با این فیلتر یافت نشد.</td>`;
                tableBody.appendChild(row);
                return;
            }

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

            addButtonEventListeners();
        }

        searchInput.addEventListener('input', filterCollaborations);
        filterSelect.addEventListener('change', filterCollaborations);

        function addButtonEventListeners() {
            document.querySelectorAll('.details-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const collabId = btn.getAttribute('data-id');
                    const collaborationData = JSON.parse(localStorage.getItem(`collaborations_${code}`)) || [];
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
                        disableBodyScroll();

                        const messagesList = document.getElementById('negotiation-messages');
                        messagesList.innerHTML = '';
                        const messages = JSON.parse(localStorage.getItem(`messages_${collabId}`)) || [];
                        messages.forEach(msg => {
                            const li = document.createElement('li');
                            li.textContent = `${msg.sender}: ${msg.text} (${msg.date})`;
                            messagesList.appendChild(li);
                        });

                        loadAgreementAndSignatures(collabId, code, collab);

                        // لود زمان‌بندی پرداخت‌ها و گزارش مالی (جدید)
                        showPaymentSchedule(collabId);
                        updateFinancialReport(collabId);
                    }
                });
            });

            document.querySelectorAll('.complete-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const collabId = btn.getAttribute('data-id');
                    const collaborationData = JSON.parse(localStorage.getItem(`collaborations_${code}`)) || [];
                    const collabIndex = collaborationData.findIndex(c => c.id == collabId);
                    if (collabIndex !== -1) {
                        collaborationData[collabIndex].status = 'completed';
                        localStorage.setItem(`collaborations_${code}`, JSON.stringify(collaborationData));
                        loadCollaborations(code);
                    }
                });
            });

            document.querySelectorAll('.cancel-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const collabId = btn.getAttribute('data-id');
                    const collaborationData = JSON.parse(localStorage.getItem(`collaborations_${code}`)) || [];
                    const collabIndex = collaborationData.findIndex(c => c.id == collabId);
                    if (collabIndex !== -1) {
                        collaborationData[collabIndex].status = 'canceled';
                        localStorage.setItem(`collaborations_${code}`, JSON.stringify(collaborationData));
                        loadCollaborations(code);
                    }
                });
            });

            document.querySelectorAll('.activate-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const collabId = btn.getAttribute('data-id');
                    const collaborationData = JSON.parse(localStorage.getItem(`collaborations_${code}`)) || [];
                    const collabIndex = collaborationData.findIndex(c => c.id == collabId);
                    if (collabIndex !== -1) {
                        collaborationData[collabIndex].status = 'active';
                        localStorage.setItem(`collaborations_${code}`, JSON.stringify(collaborationData));
                        loadCollaborations(code);
                    }
                });
            });
        }

        addButtonEventListeners();
    }

    function generateAgreementDraft(collab, companyCode) {
        const companyData = JSON.parse(localStorage.getItem(`companyData_${companyCode}`));
        const partnerData = JSON.parse(localStorage.getItem(`companyData_${collab.partnerCode}`));
        if (!companyData || !partnerData) {
            console.error('داده‌های شرکت‌ها یافت نشد.');
            return '';
        }

        const field = companyData.field;
        let commitment1 = '';
        let commitment2 = '';

        switch (field) {
            case 'فناوری اطلاعات':
                commitment1 = 'طرف اول متعهد می‌شود که خدمات توسعه نرم‌افزار را ارائه دهد.';
                commitment2 = 'طرف دوم متعهد می‌شود که پشتیبانی فنی پروژه را بر عهده گیرد.';
                break;
            case 'تولید صنعتی':
                commitment1 = 'طرف اول متعهد می‌شود که مواد اولیه مورد نیاز را تأمین کند.';
                commitment2 = 'طرف دوم متعهد می‌شود که خط تولید را راه‌اندازی کند.';
                break;
            case 'خدمات مالی':
                commitment1 = 'طرف اول متعهد می‌شود که خدمات مشاوره مالی ارائه دهد.';
                commitment2 = 'طرف دوم متعهد می‌شود که گزارش‌های مالی را به‌موقع ارائه کند.';
                break;
            default:
                commitment1 = 'طرف اول متعهد می‌شود که همکاری لازم را انجام دهد.';
                commitment2 = 'طرف دوم متعهد می‌شود که همکاری لازم را انجام دهد.';
        }

        const currentDate = new Date().toLocaleDateString('fa-IR');
        return `
تفاهم‌نامه همکاری
بین:
شرکت ${companyData.name} با کد ثبت ${companyData.code}، به نمایندگی ${companyData.name}، که از این پس "طرف اول" نامیده می‌شود،
و
شرکت ${partnerData.name} با کد ثبت ${partnerData.code}، به نمایندگی ${partnerData.name}، که از این پس "طرف دوم" نامیده می‌شود،

ماده 1 - موضوع تفاهم‌نامه:
موضوع این تفاهم‌نامه، همکاری در زمینه ${field} می‌باشد. طرفین توافق دارند که با استفاده از توانمندی‌های خود، پروژه‌های مشترکی را در این حوزه اجرا کنند.

ماده 2 - مدت تفاهم‌نامه:
این تفاهم‌نامه از تاریخ ${collab.startDate} به مدت یک سال معتبر است و در صورت توافق طرفین قابل تمدید می‌باشد.

ماده 3 - تعهدات طرفین:
${commitment1}
${commitment2}

ماده 4 - حل اختلاف:
هرگونه اختلاف ناشی از این تفاهم‌نامه از طریق مذاکره حل خواهد شد. در صورت عدم توافق، موضوع به مراجع قانونی ارجاع داده می‌شود.

این تفاهم‌نامه در تاریخ ${currentDate} تنظیم و امضا شد.
        `;
    }

    function loadAgreementAndSignatures(collabId, companyCode, collab) {
        const agreementText = document.getElementById('agreement-text');
        const signatureParty1 = document.getElementById('signature-party1');
        const signatureParty2 = document.getElementById('signature-party2');
        const party1Name = document.getElementById('party1-name');
        const party2Name = document.getElementById('party2-name');
        const signatureStatusParty1 = document.getElementById('signature-status-party1');
        const signatureStatusParty2 = document.getElementById('signature-status-party2');

        if (!agreementText || !signatureParty1 || !signatureParty2 || !party1Name || !party2Name || !signatureStatusParty1 || !signatureStatusParty2) {
            console.error('یکی از المنت‌های مورد نیاز برای تفاهم‌نامه یافت نشد.');
            return;
        }

        const companyData = JSON.parse(localStorage.getItem(`companyData_${companyCode}`));
        const partnerData = JSON.parse(localStorage.getItem(`companyData_${collab.partnerCode}`));

        if (!companyData || !partnerData) {
            console.error('داده‌های شرکت‌ها یافت نشد.');
            return;
        }

        party1Name.textContent = companyData.name;
        party2Name.textContent = partnerData.name;

        const savedAgreement = localStorage.getItem(`agreement_${collabId}`);
        if (savedAgreement) {
            agreementText.value = savedAgreement;
        } else {
            agreementText.value = generateAgreementDraft(collab, companyCode);
        }

        const signatures = JSON.parse(localStorage.getItem(`signatures_${collabId}`)) || {
            party1: { signed: false, signature: '' },
            party2: { signed: false, signature: '' }
        };

        signatureParty1.value = signatures.party1.signature || '';
        signatureParty2.value = signatures.party2.signature || 'در انتظار امضا';

        signatureStatusParty1.textContent = signatures.party1.signed ? 'امضا شده' : 'در انتظار امضا';
        signatureStatusParty2.textContent = signatures.party2.signed ? 'امضا شده' : 'در انتظار امضا';

        const generateDraftBtn = document.querySelector('.generate-draft-btn');
        const agreementStatus = document.getElementById('agreement-status');

        if (!generateDraftBtn) {
            console.error('دکمه "تولید پیش‌نویس جدید" یافت نشد. لطفاً مطمئن شوید که کلاس "generate-draft-btn" در HTML وجود دارد.');
            return;
        }

        if (!agreementStatus) {
            console.error('المنت پیام وضعیت "agreement-status" یافت نشد. لطفاً مطمئن شوید که این آیدی در HTML وجود دارد.');
            return;
        }

        generateDraftBtn.removeEventListener('click', handleGenerateDraft);
        generateDraftBtn.addEventListener('click', handleGenerateDraft);

        function handleGenerateDraft() {
            agreementText.value = '';
            localStorage.setItem(`agreement_${collabId}`, agreementText.value);
            agreementStatus.textContent = 'باکس پیش‌نویس خالی شد. لطفاً متن خود را وارد کنید.';
            agreementStatus.style.color = '#00FF99';
            agreementStatus.style.display = 'block';
            console.log('باکس پیش‌نویس خالی شد.');
        }

        let autoSaveTimeout;
        agreementText.removeEventListener('input', handleAutoSave);
        agreementText.addEventListener('input', handleAutoSave);

        function handleAutoSave() {
            clearTimeout(autoSaveTimeout);
            autoSaveTimeout = setTimeout(() => {
                localStorage.setItem(`agreement_${collabId}`, agreementText.value);
                console.log('تفاهم‌نامه به صورت خودکار ذخیره شد.');
            }, 10000);
        }
    }

    const closeCollabBtn = document.querySelector('.collaboration-close-btn');
    closeCollabBtn.addEventListener('click', () => {
        document.getElementById('collaboration-details-modal').style.display = 'none';
        enableBodyScroll();
    });

    window.addEventListener('click', (e) => {
        if (e.target === document.getElementById('collaboration-details-modal')) {
            document.getElementById('collaboration-details-modal').style.display = 'none';
            enableBodyScroll();
        }
    });

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

    const agreementForm = document.querySelector('.agreement-form');
    agreementForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const agreementText = document.getElementById('agreement-text').value;
        const signatureParty1 = document.getElementById('signature-party1').value;
        const signatureStatusParty1 = document.getElementById('signature-status-party1');
        const signatureStatusParty2 = document.getElementById('signature-status-party2');
        const agreementStatus = document.getElementById('agreement-status');
        const collabId = document.querySelector('.details-btn')?.getAttribute('data-id');
        const companyCode = document.querySelector('.company-code')?.textContent;
        const companyData = JSON.parse(localStorage.getItem(`companyData_${companyCode}`));
        const collab = JSON.parse(localStorage.getItem(`collaborations_${companyCode}`))?.find(c => c.id == collabId);

        if (!agreementText) {
            agreementStatus.textContent = 'لطفاً متن تفاهم‌نامه را وارد کنید.';
            agreementStatus.style.color = '#FF5555';
            agreementStatus.style.display = 'block';
            return;
        }

        if (!signatureParty1) {
            agreementStatus.textContent = 'لطفاً امضای طرف اول را وارد کنید.';
            agreementStatus.style.color = '#FF5555';
            agreementStatus.style.display = 'block';
            return;
        }

        if (agreementText && collabId) {
            localStorage.setItem(`agreement_${collabId}`, agreementText);

            const signatures = JSON.parse(localStorage.getItem(`signatures_${collabId}`)) || {
                party1: { signed: false, signature: '' },
                party2: { signed: false, signature: '' }
            };

            signatures.party1 = {
                signed: true,
                signature: signatureParty1 || `امضا شده توسط ${companyData.name}`
            };

            localStorage.setItem(`signatures_${collabId}`, JSON.stringify(signatures));

            signatureStatusParty1.textContent = 'امضا شده';
            signatureStatusParty2.textContent = signatures.party2.signed ? 'امضا شده' : 'در انتظار امضا';

            agreementStatus.textContent = `تفاهم‌نامه ذخیره و توسط ${companyData.name} امضا شد. در انتظار امضای ${collab.partnerName}.`;
            agreementStatus.style.color = '#00FF99';
            agreementStatus.style.display = 'block';
        }
    });

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

    const renewSubscriptionBtn = document.querySelector('.renew-subscription-btn');
    renewSubscriptionBtn.addEventListener('click', () => {
        const code = document.querySelector('.company-code')?.textContent;
        if (code) {
            const modal = document.getElementById('check-modal');
            modal.style.display = 'flex';
            document.querySelector('.result').style.display = 'none';
            document.querySelector('#company-code').value = code;
            disableBodyScroll();
        }
    });

    let smartFeaturesDB = JSON.parse(localStorage.getItem('smartFeaturesDB')) || [
        { code: "123456", field: "فناوری اطلاعات", tier: "Tier 2", collabCount: 3, avgScore: 85 },
        { code: "654321", field: "تولید صنعتی", tier: "Tier 1", collabCount: 5, avgScore: 90 },
        { code: "789123", field: "فناوری اطلاعات", tier: "Tier 3", collabCount: 1, avgScore: 75 },
        { code: "111222", field: "تولید صنعتی", tier: "Tier 2", collabCount: 2, avgScore: 80 },
        { code: "333444", field: "فناوری اطلاعات", tier: "Tier 1", collabCount: 4, avgScore: 88 }
    ];
    localStorage.setItem('smartFeaturesDB', JSON.stringify(smartFeaturesDB));

    function encodeFeatures(company) {
        const fieldMap = { "فناوری اطلاعات": 1, "تولید صنعتی": 2, "خدمات مالی": 3 };
        const tierMap = { "Tier 1": 3, "Tier 2": 2, "Tier 3": 1 };
        return [
            fieldMap[company.field] || 0,
            tierMap[company.tier] || 0,
            company.collabCount || 0,
            company.avgScore || 0
        ];
    }

    function calculateDistance(features1, features2) {
        return Math.sqrt(features1.reduce((sum, val, i) => sum + (val - features2[i]) ** 2, 0));
    }

    function findSmartSuggestions(currentCompanyCode) {
        const currentCompany = smartFeaturesDB.find(c => c.code === currentCompanyCode);
        if (!currentCompany) return [];

        const currentFeatures = encodeFeatures(currentCompany);
        const suggestions = smartFeaturesDB
            .filter(c => c.code !== currentCompanyCode)
            .map(c => {
                const features = encodeFeatures(c);
                const distance = calculateDistance(currentFeatures, features);
                const companyData = JSON.parse(localStorage.getItem(`companyData_${c.code}`)) || { name: c.code };
                return {
                    code: c.code,
                    name: companyData.name,
                    field: c.field,
                    tier: c.tier,
                    distance: distance,
                    score: 100 - (distance * 10)
                };
            })
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 3);

        return suggestions;
    }

    function loadSmartSuggestions(code) {
        const smartSuggestionsList = document.getElementById('smart-suggestions-list');
        const smartLoading = document.querySelector('.smart-loading');
        if (!smartSuggestionsList || !smartLoading) {
            console.error('المنت‌های پیشنهادات هوشمند یافت نشدند.');
            return;
        }

        smartLoading.style.display = 'block';
        smartSuggestionsList.innerHTML = '';

        setTimeout(() => {
            const suggestions = findSmartSuggestions(code);
            suggestions.forEach(suggestion => {
                const li = document.createElement('li');
                li.innerHTML = `
                    ${suggestion.name} (${suggestion.field}، ${suggestion.tier}) - امتیاز تطابق: ${Math.round(suggestion.score)}%
                    <button class="btn smart-request-btn" data-code="${suggestion.code}">درخواست همکاری</button>
                `;
                smartSuggestionsList.appendChild(li);
            });

            animateListItems('smart-suggestions-list');

            document.querySelectorAll('.smart-request-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const receiverCode = btn.getAttribute('data-code');
                    sendCollaborationRequest(code, receiverCode);
                });
            });

            smartLoading.style.display = 'none';
        }, 1000);
    }

    const updateSuggestionsBtn = document.querySelector('.update-suggestions-btn');
    if (updateSuggestionsBtn) {
        updateSuggestionsBtn.addEventListener('click', () => {
            const code = document.querySelector('.company-code')?.textContent;
            if (code) {
                loadSmartSuggestions(code);
            }
        });
    }

    // --- امکانات جدید: مدیریت مالی ---

    function registerCheck(event) {
        event.preventDefault();
        const collabId = document.querySelector('.details-btn').getAttribute('data-id');
        const checkNumber = document.getElementById('check-number').value.trim();
        const checkAmount = parseInt(document.getElementById('check-amount').value);
        const checkDueDate = document.getElementById('check-due-date').value;

        if (!checkNumber || !checkAmount || !checkDueDate) {
            document.getElementById('check-status').textContent = 'لطفاً تمام فیلدها را پر کنید.';
            document.getElementById('check-status').style.display = 'block';
            return;
        }

        const payments = JSON.parse(localStorage.getItem(`payments_${collabId}`)) || [];
        const newPayment = {
            id: payments.length + 1,
            amount: checkAmount,
            dueDate: new Date(checkDueDate).toLocaleDateString('fa-IR'),
            status: 'در انتظار'
        };
        payments.push(newPayment);
        localStorage.setItem(`payments_${collabId}`, JSON.stringify(payments));

        document.getElementById('check-status').textContent = 'چک با موفقیت ثبت شد.';
        document.getElementById('check-status').style.display = 'block';
        document.getElementById('check-form').reset();

        showPaymentSchedule(collabId);
        updateFinancialReport(collabId);
    }

    function showPaymentSchedule(collabId) {
        const tableBody = document.getElementById('payment-schedule-table-body');
        tableBody.innerHTML = '';

        const payments = JSON.parse(localStorage.getItem(`payments_${collabId}`)) || [];
        if (payments.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5">پرداختی ثبت نشده است.</td></tr>';
            return;
        }

        payments.forEach(payment => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${payment.id}</td>
                <td>${payment.amount.toLocaleString()}</td>
                <td>${payment.dueDate}</td>
                <td><span class="status ${payment.status === 'پرداخت‌شده' ? 'paid' : 'pending'}">${payment.status}</span></td>
                <td>${
                    payment.status === 'در انتظار' ?
                    `<button class="btn" onclick="markAsPaid('${collabId}', ${payment.id})">پرداخت</button>` :
                    ''
                }</td>
            `;
            tableBody.appendChild(tr);
        });
    }

    function markAsPaid(collabId, paymentId) {
        const payments = JSON.parse(localStorage.getItem(`payments_${collabId}`)) || [];
        const payment = payments.find(p => p.id === paymentId);
        if (payment) {
            payment.status = 'پرداخت‌شده';
            localStorage.setItem(`payments_${collabId}`, JSON.stringify(payments));
            showPaymentSchedule(collabId);
            updateFinancialReport(collabId);
        }
    }

    function updateFinancialReport(collabId) {
        const payments = JSON.parse(localStorage.getItem(`payments_${collabId}`)) || [];
        const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
        const paidAmount = payments.filter(p => p.status === 'پرداخت‌شده').reduce((sum, p) => sum + p.amount, 0);
        const remainingAmount = totalAmount - paidAmount;

        document.getElementById('total-contract-amount').textContent = totalAmount.toLocaleString();
        document.getElementById('paid-amount').textContent = paidAmount.toLocaleString();
        document.getElementById('remaining-amount').textContent = remainingAmount.toLocaleString();
    }

    function extendPaymentSchedule() {
        const collabId = document.querySelector('.details-btn').getAttribute('data-id');
        const payments = JSON.parse(localStorage.getItem(`payments_${collabId}`)) || [];
        payments.forEach(payment => {
            if (payment.status === 'در انتظار') {
                const dueDate = new Date(payment.dueDate.split('/').reverse().join('-'));
                dueDate.setMonth(dueDate.getMonth() + 1);
                payment.dueDate = dueDate.toLocaleDateString('fa-IR');
            }
        });
        localStorage.setItem(`payments_${collabId}`, JSON.stringify(payments));
        showPaymentSchedule(collabId);
    }

    document.querySelector('.check-form').addEventListener('submit', registerCheck);

    document.querySelector('.extend-payment-btn').addEventListener('click', extendPaymentSchedule);
});
    // --- ادامه امکانات جدید: مدیریت مالی ---

    // تابع برای محاسبه جریمه دیرکرد
    function calculateLateFee(collabId) {
        const payments = JSON.parse(localStorage.getItem(`payments_${collabId}`)) || [];
        let totalLateFee = 0;
        const today = new Date();

        payments.forEach(payment => {
            if (payment.status === 'در انتظار') {
                const dueDate = new Date(payment.dueDate.split('/').reverse().join('-'));
                if (today > dueDate) {
                    const daysLate = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));
                    const lateFee = payment.amount * 0.001 * daysLate; // 0.1% جریمه به ازای هر روز
                    totalLateFee += lateFee;
                }
            }
        });

        document.getElementById('late-fee-amount').textContent = totalLateFee.toLocaleString();
        return totalLateFee;
    }

    // تابع برای ارسال اعلان پرداخت
    function sendPaymentReminder(collabId) {
        const payments = JSON.parse(localStorage.getItem(`payments_${collabId}`)) || [];
        const companyCode = document.querySelector('.company-code')?.textContent;
        const notificationsList = document.getElementById('notifications-list');
        const today = new Date();

        payments.forEach(payment => {
            if (payment.status === 'در انتظار') {
                const dueDate = new Date(payment.dueDate.split('/').reverse().join('-'));
                const daysUntilDue = Math.floor((dueDate - today) / (1000 * 60 * 60 * 24));
                if (daysUntilDue <= 3 && daysUntilDue >= 0) {
                    const li = document.createElement('li');
                    li.textContent = `یادآوری: پرداخت ${payment.amount.toLocaleString()} تومان تا تاریخ ${payment.dueDate} سررسید می‌شود.`;
                    notificationsList.insertBefore(li, notificationsList.firstChild);
                    setTimeout(() => {
                        li.classList.add('visible');
                    }, 100);
                }
            }
        });
    }

    // تابع برای ثبت تراکنش مالی
    function recordTransaction(collabId, amount, type, description) {
        const transactions = JSON.parse(localStorage.getItem(`transactions_${collabId}`)) || [];
        const transaction = {
            id: transactions.length + 1,
            amount: amount,
            type: type, // 'income' یا 'expense'
            description: description,
            date: new Date().toLocaleString('fa-IR')
        };
        transactions.push(transaction);
        localStorage.setItem(`transactions_${collabId}`, JSON.stringify(transactions));
        updateFinancialReport(collabId);
    }

    // تابع برای نمایش تاریخچه تراکنش‌ها
    function showTransactionHistory(collabId) {
        const tableBody = document.getElementById('transaction-history-table-body');
        tableBody.innerHTML = '';

        const transactions = JSON.parse(localStorage.getItem(`transactions_${collabId}`)) || [];
        if (transactions.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="4">تراکنشی ثبت نشده است.</td></tr>';
            return;
        }

        transactions.forEach(transaction => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${transaction.id}</td>
                <td>${transaction.amount.toLocaleString()}</td>
                <td>${transaction.type === 'income' ? 'درآمد' : 'هزینه'}</td>
                <td>${transaction.description}</td>
                <td>${transaction.date}</td>
            `;
            tableBody.appendChild(tr);
        });
    }

    // تابع برای ثبت هزینه جدید
    function registerExpense(event) {
        event.preventDefault();
        const collabId = document.querySelector('.details-btn').getAttribute('data-id');
        const expenseAmount = parseInt(document.getElementById('expense-amount').value);
        const expenseDescription = document.getElementById('expense-description').value.trim();

        if (!expenseAmount || !expenseDescription) {
            document.getElementById('expense-status').textContent = 'لطفاً تمام فیلدها را پر کنید.';
            document.getElementById('expense-status').style.display = 'block';
            return;
        }

        recordTransaction(collabId, expenseAmount, 'expense', expenseDescription);
        document.getElementById('expense-status').textContent = 'هزینه با موفقیت ثبت شد.';
        document.getElementById('expense-status').style.display = 'block';
        document.getElementById('expense-form').reset();
        showTransactionHistory(collabId);
    }

    // تابع برای ثبت درآمد جدید
    function registerIncome(event) {
        event.preventDefault();
        const collabId = document.querySelector('.details-btn').getAttribute('data-id');
        const incomeAmount = parseInt(document.getElementById('income-amount').value);
        const incomeDescription = document.getElementById('income-description').value.trim();

        if (!incomeAmount || !incomeDescription) {
            document.getElementById('income-status').textContent = 'لطفاً تمام فیلدها را پر کنید.';
            document.getElementById('income-status').style.display = 'block';
            return;
        }

        recordTransaction(collabId, incomeAmount, 'income', incomeDescription);
        document.getElementById('income-status').textContent = 'درآمد با موفقیت ثبت شد.';
        document.getElementById('income-status').style.display = 'block';
        document.getElementById('income-form').reset();
        showTransactionHistory(collabId);
    }

    // تابع برای محاسبه سود و زیان
    function calculateProfitLoss(collabId) {
        const transactions = JSON.parse(localStorage.getItem(`transactions_${collabId}`)) || [];
        const totalIncome = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        const totalExpense = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
        const profitLoss = totalIncome - totalExpense;

        document.getElementById('total-income').textContent = totalIncome.toLocaleString();
        document.getElementById('total-expense').textContent = totalExpense.toLocaleString();
        document.getElementById('profit-loss').textContent = profitLoss.toLocaleString();
        document.getElementById('profit-loss').style.color = profitLoss >= 0 ? '#00FF99' : '#FF5555';
    }

    // تابع برای به‌روزرسانی گزارش مالی با جریمه و سود و زیان
    function updateFinancialReport(collabId) {
        const payments = JSON.parse(localStorage.getItem(`payments_${collabId}`)) || [];
        const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
        const paidAmount = payments.filter(p => p.status === 'پرداخت‌شده').reduce((sum, p) => sum + p.amount, 0);
        const remainingAmount = totalAmount - paidAmount;

        document.getElementById('total-contract-amount').textContent = totalAmount.toLocaleString();
        document.getElementById('paid-amount').textContent = paidAmount.toLocaleString();
        document.getElementById('remaining-amount').textContent = remainingAmount.toLocaleString();

        calculateLateFee(collabId);
        calculateProfitLoss(collabId);
        showTransactionHistory(collabId);
        sendPaymentReminder(collabId);
    }

    // اتصال رویدادها برای فرم‌های مالی
    document.querySelector('.expense-form').addEventListener('submit', registerExpense);
    document.querySelector('.income-form').addEventListener('submit', registerIncome);

    // --- امکانات جدید: مدیریت مالی پیشرفته ---

    // تابع برای تنظیم بودجه همکاری
    function setCollaborationBudget(event) {
        event.preventDefault();
        const collabId = document.querySelector('.details-btn').getAttribute('data-id');
        const budgetAmount = parseInt(document.getElementById('budget-amount').value);
        const budgetDescription = document.getElementById('budget-description').value.trim();

        if (!budgetAmount || !budgetDescription) {
            document.getElementById('budget-status').textContent = 'لطفاً تمام فیلدها را پر کنید.';
            document.getElementById('budget-status').style.display = 'block';
            return;
        }

        const budget = {
            amount: budgetAmount,
            description: budgetDescription,
            date: new Date().toLocaleString('fa-IR')
        };
        localStorage.setItem(`budget_${collabId}`, JSON.stringify(budget));

        document.getElementById('budget-status').textContent = 'بودجه با موفقیت تنظیم شد.';
        document.getElementById('budget-status').style.display = 'block';
        document.getElementById('budget-form').reset();
        showBudgetDetails(collabId);
    }

    // تابع برای نمایش جزئیات بودجه
    function showBudgetDetails(collabId) {
        const budget = JSON.parse(localStorage.getItem(`budget_${collabId}`)) || { amount: 0, description: 'ندارد', date: 'ندارد' };
        document.getElementById('budget-amount-display').textContent = budget.amount.toLocaleString();
        document.getElementById('budget-description-display').textContent = budget.description;
        document.getElementById('budget-date-display').textContent = budget.date;

        const transactions = JSON.parse(localStorage.getItem(`transactions_${collabId}`)) || [];
        const totalExpense = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
        const remainingBudget = budget.amount - totalExpense;

        document.getElementById('remaining-budget').textContent = remainingBudget.toLocaleString();
        document.getElementById('remaining-budget').style.color = remainingBudget >= 0 ? '#00FF99' : '#FF5555';
    }

    // تابع برای ارسال اعلان بودجه
    function sendBudgetAlert(collabId) {
        const budget = JSON.parse(localStorage.getItem(`budget_${collabId}`)) || { amount: 0 };
        const transactions = JSON.parse(localStorage.getItem(`transactions_${collabId}`)) || [];
        const totalExpense = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
        const remainingBudget = budget.amount - totalExpense;

        if (remainingBudget <= budget.amount * 0.1) { // اگر کمتر از 10% بودجه باقی مانده باشد
            const notificationsList = document.getElementById('notifications-list');
            const li = document.createElement('li');
            li.textContent = `هشدار: بودجه همکاری (${collabId}) رو به اتمام است. بودجه باقی‌مانده: ${remainingBudget.toLocaleString()} تومان`;
            notificationsList.insertBefore(li, notificationsList.firstChild);
            setTimeout(() => {
                li.classList.add('visible');
            }, 100);
        }
    }

    // اتصال رویداد برای فرم بودجه
    document.querySelector('.budget-form').addEventListener('submit', setCollaborationBudget);

    // --- امکانات جدید: گزارش مالی پیشرفته ---

    // تابع برای تولید گزارش مالی PDF (شبیه‌سازی)
    function generateFinancialReportPDF(collabId) {
        const payments = JSON.parse(localStorage.getItem(`payments_${collabId}`)) || [];
        const transactions = JSON.parse(localStorage.getItem(`transactions_${collabId}`)) || [];
        const budget = JSON.parse(localStorage.getItem(`budget_${collabId}`)) || { amount: 0, description: 'ندارد' };

        const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
        const paidAmount = payments.filter(p => p.status === 'پرداخت‌شده').reduce((sum, p) => sum + p.amount, 0);
        const remainingAmount = totalAmount - paidAmount;

        const totalIncome = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        const totalExpense = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
        const profitLoss = totalIncome - totalExpense;

        const lateFee = calculateLateFee(collabId);
        const remainingBudget = budget.amount - totalExpense;

        const reportContent = `
گزارش مالی همکاری (شناسه: ${collabId})
----------------------------------------
کل مبلغ قرارداد: ${totalAmount.toLocaleString()} تومان
مبلغ پرداخت‌شده: ${paidAmount.toLocaleString()} تومان
مبلغ باقی‌مانده: ${remainingAmount.toLocaleString()} تومان
----------------------------------------
کل درآمد: ${totalIncome.toLocaleString()} تومان
کل هزینه: ${totalExpense.toLocaleString()} تومان
سود/زیان: ${profitLoss.toLocaleString()} تومان
----------------------------------------
جریمه دیرکرد: ${lateFee.toLocaleString()} تومان
----------------------------------------
بودجه تنظیم‌شده: ${budget.amount.toLocaleString()} تومان
توضیحات بودجه: ${budget.description}
بودجه باقی‌مانده: ${remainingBudget.toLocaleString()} تومان
----------------------------------------
تاریخ گزارش: ${new Date().toLocaleString('fa-IR')}
        `;

        // شبیه‌سازی دانلود PDF
        const blob = new Blob([reportContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Financial_Report_${collabId}.txt`; // در عمل باید PDF باشد
        a.click();
        window.URL.revokeObjectURL(url);

        const notificationsList = document.getElementById('notifications-list');
        const li = document.createElement('li');
        li.textContent = `گزارش مالی برای همکاری ${collabId} تولید و دانلود شد.`;
        notificationsList.insertBefore(li, notificationsList.firstChild);
        setTimeout(() => {
            li.classList.add('visible');
        }, 100);
    }

    // تابع برای ارسال گزارش مالی به ایمیل (شبیه‌سازی)
    function sendFinancialReportEmail(collabId) {
        const companyCode = document.querySelector('.company-code')?.textContent;
        const companyData = JSON.parse(localStorage.getItem(`companyData_${companyCode}`));
        const notificationsList = document.getElementById('notifications-list');

        const li = document.createElement('li');
        li.textContent = `گزارش مالی برای ${companyData.name} به ایمیل شما ارسال شد.`;
        notificationsList.insertBefore(li, notificationsList.firstChild);
        setTimeout(() => {
            li.classList.add('visible');
        }, 100);
    }

    // اتصال رویدادها برای دکمه‌های گزارش مالی
    document.querySelector('.generate-report-btn').addEventListener('click', () => {
        const collabId = document.querySelector('.details-btn').getAttribute('data-id');
        generateFinancialReportPDF(collabId);
    });

    document.querySelector('.email-report-btn').addEventListener('click', () => {
        const collabId = document.querySelector('.details-btn').getAttribute('data-id');
        sendFinancialReportEmail(collabId);
    });

    // --- امکانات جدید: پیش‌بینی مالی ---

    // تابع برای پیش‌بینی جریان نقدی
    function forecastCashFlow(collabId) {
        const payments = JSON.parse(localStorage.getItem(`payments_${collabId}`)) || [];
        const transactions = JSON.parse(localStorage.getItem(`transactions_${collabId}`)) || [];

        const totalIncome = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        const totalExpense = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const remainingPayments = payments
            .filter(p => p.status === 'در انتظار')
            .reduce((sum, p) => sum + p.amount, 0);

        const lateFee = calculateLateFee(collabId);
        const projectedCashFlow = (totalIncome - totalExpense) - remainingPayments - lateFee;

        document.getElementById('projected-cash-flow').textContent = projectedCashFlow.toLocaleString();
        document.getElementById('projected-cash-flow').style.color = projectedCashFlow >= 0 ? '#00FF99' : '#FF5555';
    }

    // تابع برای پیش‌بینی سود و زیان
    function forecastProfitLoss(collabId) {
        const transactions = JSON.parse(localStorage.getItem(`transactions_${collabId}`)) || [];
        const totalIncome = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        const totalExpense = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        // فرض می‌کنیم در ماه آینده 10% افزایش درآمد و 5% افزایش هزینه داشته باشیم
        const projectedIncome = totalIncome * 1.1;
        const projectedExpense = totalExpense * 1.05;
        const projectedProfitLoss = projectedIncome - projectedExpense;

        document.getElementById('projected-profit-loss').textContent = projectedProfitLoss.toLocaleString();
        document.getElementById('projected-profit-loss').style.color = projectedProfitLoss >= 0 ? '#00FF99' : '#FF5555';
    }

    // تابع برای به‌روزرسانی پیش‌بینی‌ها
    function updateForecasts(collabId) {
        forecastCashFlow(collabId);
        forecastProfitLoss(collabId);
    }

    // اتصال رویداد برای دکمه به‌روزرسانی پیش‌بینی‌ها
    document.querySelector('.update-forecast-btn').addEventListener('click', () => {
        const collabId = document.querySelector('.details-btn').getAttribute('data-id');
        updateForecasts(collabId);
    });

    // --- امکانات جدید: مدیریت مالیات ---

    // تابع برای محاسبه مالیات
    function calculateTax(collabId) {
        const transactions = JSON.parse(localStorage.getItem(`transactions_${collabId}`)) || [];
        const totalIncome = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const taxRate = 0.1; // فرض می‌کنیم نرخ مالیات 10% باشد
        const taxAmount = totalIncome * taxRate;

        document.getElementById('tax-amount').textContent = taxAmount.toLocaleString();

        const taxDueDate = new Date();
        taxDueDate.setMonth(taxDueDate.getMonth() + 1);
        document.getElementById('tax-due-date').textContent = taxDueDate.toLocaleDateString('fa-IR');

        return taxAmount;
    }

    // تابع برای ثبت پرداخت مالیات
    function payTax(event) {
        event.preventDefault();
        const collabId = document.querySelector('.details-btn').getAttribute('data-id');
        const taxAmount = calculateTax(collabId);

        recordTransaction(collabId, taxAmount, 'expense', 'پرداخت مالیات');
        document.getElementById('tax-status').textContent = 'مالیات با موفقیت پرداخت شد.';
        document.getElementById('tax-status').style.display = 'block';

        showTransactionHistory(collabId);
        updateFinancialReport(collabId);
    }

    // اتصال رویداد برای فرم پرداخت مالیات
    document.querySelector('.tax-form').addEventListener('submit', payTax);

    // --- امکانات جدید: تحلیل مالی ---

    // تابع برای تحلیل روند مالی
    function analyzeFinancialTrend(collabId) {
        const transactions = JSON.parse(localStorage.getItem(`transactions_${collabId}`)) || [];
        if (transactions.length < 2) {
            document.getElementById('financial-trend').textContent = 'داده کافی برای تحلیل روند وجود ندارد.';
            return;
        }

        const incomes = transactions.filter(t => t.type === 'income');
        const expenses = transactions.filter(t => t.type === 'expense');

        const incomeTrend = incomes.length > 1 ? (incomes[incomes.length - 1].amount - incomes[0].amount) / incomes[0].amount * 100 : 0;
        const expenseTrend = expenses.length > 1 ? (expenses[expenses.length - 1].amount - expenses[0].amount) / expenses[0].amount * 100 : 0;

        document.getElementById('income-trend').textContent = `${incomeTrend.toFixed(2)}% ${incomeTrend >= 0 ? 'افزایش' : 'کاهش'}`;
        document.getElementById('income-trend').style.color = incomeTrend >= 0 ? '#00FF99' : '#FF5555';

        document.getElementById('expense-trend').textContent = `${expenseTrend.toFixed(2)}% ${expenseTrend >= 0 ? 'افزایش' : 'کاهش'}`;
        document.getElementById('expense-trend').style.color = expenseTrend >= 0 ? '#FF5555' : '#00FF99';
    }

    // تابع برای به‌روزرسانی تحلیل مالی
    function updateFinancialAnalysis(collabId) {
        analyzeFinancialTrend(collabId);
        calculateTax(collabId);
    }

    // اتصال رویداد برای دکمه به‌روزرسانی تحلیل مالی
    document.querySelector('.update-analysis-btn').addEventListener('click', () => {
        const collabId = document.querySelector('.details-btn').getAttribute('data-id');
        updateFinancialAnalysis(collabId);
    });

    // --- امکانات جدید: اعلان‌های مالی پیشرفته ---

    // تابع برای ارسال اعلان‌های مالی دوره‌ای
    function scheduleFinancialNotifications(collabId) {
        const payments = JSON.parse(localStorage.getItem(`payments_${collabId}`)) || [];
        const transactions = JSON.parse(localStorage.getItem(`transactions_${collabId}`)) || [];
        const notificationsList = document.getElementById('notifications-list');

        // اعلان برای پرداخت‌های نزدیک به سررسید
        sendPaymentReminder(collabId);

        // اعلان برای بودجه
        sendBudgetAlert(collabId);

        // اعلان برای سود و زیان
        const totalIncome = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        const totalExpense = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
        const profitLoss = totalIncome - totalExpense;

        if (profitLoss < 0) {
            const li = document.createElement('li');
            li.textContent = `هشدار: همکاری (${collabId}) در حال ضرر است. زیان: ${Math.abs(profitLoss).toLocaleString()} تومان`;
            notificationsList.insertBefore(li, notificationsList.firstChild);
            setTimeout(() => {
                li.classList.add('visible');
            }, 100);
        }
    }

    // تابع برای زمان‌بندی اعلان‌ها (شبیه‌سازی با setInterval)
    function startFinancialNotificationScheduler(collabId) {
        scheduleFinancialNotifications(collabId);
        setInterval(() => {
            scheduleFinancialNotifications(collabId);
        }, 24 * 60 * 60 * 1000); // هر 24 ساعت
    }

    // فراخوانی زمان‌بندی اعلان‌ها هنگام لود داشبورد
    document.addEventListener('dashboardLoaded', (e) => {
        const collabId = e.detail.collabId;
        startFinancialNotificationScheduler(collabId);
    });

    // --- امکانات جدید: داشبورد مالی ---

    // تابع برای لود داشبورد مالی
    function loadFinancialDashboard(collabId) {
        updateFinancialReport(collabId);
        showPaymentSchedule(collabId);
        showTransactionHistory(collabId);
        showBudgetDetails(collabId);
        updateForecasts(collabId);
        updateFinancialAnalysis(collabId);
        scheduleFinancialNotifications(collabId);
    }

    // فراخوانی داشبورد مالی هنگام باز کردن جزئیات همکاری
    document.querySelectorAll('.details-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const collabId = btn.getAttribute('data-id');
            loadFinancialDashboard(collabId);
        });
    });

    // --- امکانات جدید: مدیریت ارز ---

    // تابع برای تبدیل ارز (شبیه‌سازی)
    function convertCurrency(amount, fromCurrency, toCurrency) {
        const exchangeRates = {
            IRR: { USD: 0.000024, EUR: 0.000022 },
            USD: { IRR: 42000, EUR: 0.92 },
            EUR: { IRR: 46000, USD: 1.09 }
        };

        if (!exchangeRates[fromCurrency] || !exchangeRates[fromCurrency][toCurrency]) {
            return amount;
        }

        return (amount * exchangeRates[fromCurrency][toCurrency]).toFixed(2);
    }

    // تابع برای نمایش مبالغ به ارزهای مختلف
    function displayCurrencyConversion(collabId) {
        const payments = JSON.parse(localStorage.getItem(`payments_${collabId}`)) || [];
        const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);

        document.getElementById('total-amount-usd').textContent = convertCurrency(totalAmount, 'IRR', 'USD');
        document.getElementById('total-amount-eur').textContent = convertCurrency(totalAmount, 'IRR', 'EUR');
    }

    // اتصال رویداد برای دکمه تبدیل ارز
    document.querySelector('.convert-currency-btn').addEventListener('click', () => {
        const collabId = document.querySelector('.details-btn').getAttribute('data-id');
        displayCurrencyConversion(collabId);
    });

    // --- امکانات جدید: پشتیبانی چندزبانه برای مالی ---

    // تابع برای تغییر زبان بخش مالی
    function changeFinancialLanguage(language) {
        const financialLabels = {
            fa: {
                totalContractAmount: 'کل مبلغ قرارداد',
                paidAmount: 'مبلغ پرداخت‌شده',
                remainingAmount: 'مبلغ باقی‌مانده',
                lateFee: 'جریمه دیرکرد',
                totalIncome: 'کل درآمد',
                totalExpense: 'کل هزینه',
                profitLoss: 'سود/زیان',
                projectedCashFlow: 'جریان نقدی پیش‌بینی‌شده',
                projectedProfitLoss: 'سود/زیان پیش‌بینی‌شده',
                taxAmount: 'مبلغ مالیات',
                taxDueDate: 'تاریخ سررسید مالیات'
            },
            en: {
                totalContractAmount: 'Total Contract Amount',
                paidAmount: 'Paid Amount',
                remainingAmount: 'Remaining Amount',
                lateFee: 'Late Fee',
                totalIncome: 'Total Income',
                totalExpense: 'Total Expense',
                profitLoss: 'Profit/Loss',
                projectedCashFlow: 'Projected Cash Flow',
                projectedProfitLoss: 'Projected Profit/Loss',
                taxAmount: 'Tax Amount',
                taxDueDate: 'Tax Due Date'
            }
        };

        const labels = financialLabels[language] || financialLabels['fa'];
        document.getElementById('total-contract-amount-label').textContent = labels.totalContractAmount;
        document.getElementById('paid-amount-label').textContent = labels.paidAmount;
        document.getElementById('remaining-amount-label').textContent = labels.remainingAmount;
        document.getElementById('late-fee-label').textContent = labels.lateFee;
        document.getElementById('total-income-label').textContent = labels.totalIncome;
        document.getElementById('total-expense-label').textContent = labels.totalExpense;
        document.getElementById('profit-loss-label').textContent = labels.profitLoss;
        document.getElementById('projected-cash-flow-label').textContent = labels.projectedCashFlow;
        document.getElementById('projected-profit-loss-label').textContent = labels.projectedProfitLoss;
        document.getElementById('tax-amount-label').textContent = labels.taxAmount;
        document.getElementById('tax-due-date-label').textContent = labels.taxDueDate;
    }

    // اتصال رویداد برای تغییر زبان
    document.querySelector('.language-select').addEventListener('change', (e) => {
        changeFinancialLanguage(e.target.value);
    });

    // --- امکانات جدید: بکاپ و بازیابی داده‌های مالی ---

    // تابع برای بکاپ داده‌های مالی
    function backupFinancialData(collabId) {
        const payments = JSON.parse(localStorage.getItem(`payments_${collabId}`)) || [];
        const transactions = JSON.parse(localStorage.getItem(`transactions_${collabId}`)) || [];
        const budget = JSON.parse(localStorage.getItem(`budget_${collabId}`)) || {};

        const backupData = {
            payments,
            transactions,
            budget,
            timestamp: new Date().toLocaleString('fa-IR')
        };

        localStorage.setItem(`financialBackup_${collabId}`, JSON.stringify(backupData));

        const notificationsList = document.getElementById('notifications-list');
        const li = document.createElement('li');
        li.textContent = `بکاپ داده‌های مالی برای همکاری ${collabId} با موفقیت انجام شد.`;
        notificationsList.insertBefore(li, notificationsList.firstChild);
        setTimeout(() => {
            li.classList.add('visible');
        }, 100);
    }

    // تابع برای بازیابی داده‌های مالی
    function restoreFinancialData(collabId) {
        const backupData = JSON.parse(localStorage.getItem(`financialBackup_${collabId}`));
        if (!backupData) {
            const notificationsList = document.getElementById('notifications-list');
            const li = document.createElement('li');
            li.textContent = `بکاپی برای همکاری ${collabId} یافت نشد.`;
            notificationsList.insertBefore(li, notificationsList.firstChild);
            setTimeout(() => {
                li.classList.add('visible');
            }, 100);
            return;
        }

        localStorage.setItem(`payments_${collabId}`, JSON.stringify(backupData.payments));
        localStorage.setItem(`transactions_${collabId}`, JSON.stringify(backupData.transactions));
        localStorage.setItem(`budget_${collabId}`, JSON.stringify(backupData.budget));

        loadFinancialDashboard(collabId);

        const notificationsList = document.getElementById('notifications-list');
        const li = document.createElement('li');
        li.textContent = `داده‌های مالی برای همکاری ${collabId} با موفقیت بازیابی شد.`;
        notificationsList.insertBefore(li, notificationsList.firstChild);
        setTimeout(() => {
            li.classList.add('visible');
        }, 100);
    }

    // اتصال رویدادها برای دکمه‌های بکاپ و بازیابی
    document.querySelector('.backup-financial-btn').addEventListener('click', () => {
        const collabId = document.querySelector('.details-btn').getAttribute('data-id');
        backupFinancialData(collabId);
    });

    document.querySelector('.restore-financial-btn').addEventListener('click', () => {
        const collabId = document.querySelector('.details-btn').getAttribute('data-id');
        restoreFinancialData(collabId);
    });

    // --- امکانات جدید: نمودارهای مالی ---

    // تابع برای رسم نمودار مالی (شبیه‌سازی با console.log)
    function drawFinancialChart(collabId) {
        const transactions = JSON.parse(localStorage.getItem(`transactions_${collabId}`)) || [];
        const incomes = transactions.filter(t => t.type === 'income');
        const expenses = transactions.filter(t => t.type === 'expense');

        console.log('نمودار درآمدها:');
        incomes.forEach(t => console.log(`تاریخ: ${t.date} - مبلغ: ${t.amount.toLocaleString()}`));
        console.log('نمودار هزینه‌ها:');
        expenses.forEach(t => console.log(`تاریخ: ${t.date} - مبلغ: ${t.amount.toLocaleString()}`));

        // در عمل باید از کتابخانه‌ای مثل Chart.js استفاده شود
        const notificationsList = document.getElementById('notifications-list');
        const li = document.createElement('li');
        li.textContent = `نمودار مالی برای همکاری ${collabId} در کنسول نمایش داده شد.`;
        notificationsList.insertBefore(li, notificationsList.firstChild);
        setTimeout(() => {
            li.classList.add('visible');
        }, 100);
    }

    // اتصال رویداد برای دکمه رسم نمودار
    document.querySelector('.draw-chart-btn').addEventListener('click', () => {
        const collabId = document.querySelector('.details-btn').getAttribute('data-id');
        drawFinancialChart(collabId);
    });

    // --- امکانات جدید: امنیت داده‌های مالی ---

    // تابع برای رمزنگاری داده‌ها (شبیه‌سازی ساده)
    function encryptFinancialData(data) {
        // شبیه‌سازی رمزنگاری با Base64
        return btoa(JSON.stringify(data));
    }

    // تابع برای رمزگشایی داده‌ها
    function decryptFinancialData(encryptedData) {
        return JSON.parse(atob(encryptedData));
    }

    // تابع برای ذخیره امن داده‌ها
    function secureSaveFinancialData(collabId) {
        const payments = JSON.parse(localStorage.getItem(`payments_${collabId}`)) || [];
        const transactions = JSON.parse(localStorage.getItem(`transactions_${collabId}`)) || [];
        const budget = JSON.parse(localStorage.getItem(`budget_${collabId}`)) || {};

        const financialData = { payments, transactions, budget };
        const encryptedData = encryptFinancialData(financialData);
        localStorage.setItem(`secureFinancialData_${collabId}`, encryptedData);
    }

    // تابع برای لود امن داده‌ها
    function secureLoadFinancialData(collabId) {
        const encryptedData = localStorage.getItem(`secureFinancialData_${collabId}`);
        if (encryptedData) {
            const financialData = decryptFinancialData(encryptedData);
            localStorage.setItem(`payments_${collabId}`, JSON.stringify(financialData.payments));
            localStorage.setItem(`transactions_${collabId}`, JSON.stringify(financialData.transactions));
            localStorage.setItem(`budget_${collabId}`, JSON.stringify(financialData.budget));
            loadFinancialDashboard(collabId);
        }
    }

    // اتصال رویدادها برای ذخیره و لود امن
    document.querySelector('.secure-save-btn').addEventListener('click', () => {
        const collabId = document.querySelector('.details-btn').getAttribute('data-id');
        secureSaveFinancialData(collabId);
        const notificationsList = document.getElementById('notifications-list');
        const li = document.createElement('li');
        li.textContent = `داده‌های مالی برای همکاری ${collabId} به صورت امن ذخیره شد.`;
        notificationsList.insertBefore(li, notificationsList.firstChild);
        setTimeout(() => {
            li.classList.add('visible');
        }, 100);
    });

    document.querySelector('.secure-load-btn').addEventListener('click', () => {
        const collabId = document.querySelector('.details-btn').getAttribute('data-id');
        secureLoadFinancialData(collabId);
        const notificationsList = document.getElementById('notifications-list');
        const li = document.createElement('li');
        li.textContent = `داده‌های مالی برای همکاری ${collabId} به صورت امن لود شد.`;
        notificationsList.insertBefore(li, notificationsList.firstChild);
        setTimeout(() => {
            li.classList.add('visible');
        }, 100);
    });

    // --- امکانات جدید: ادغام با سیستم حسابداری ---

    // تابع برای همگام‌سازی با سیستم حسابداری (شبیه‌سازی)
    function syncWithAccountingSystem(collabId) {
        const payments = JSON.parse(localStorage.getItem(`payments_${collabId}`)) || [];
        const transactions = JSON.parse(localStorage.getItem(`transactions_${collabId}`)) || [];

        console.log('همگام‌سازی با سیستم حسابداری:');
        console.log('پرداخت‌ها:', payments);
        console.log('تراکنش‌ها:', transactions);

        const notificationsList = document.getElementById('notifications-list');
        const li = document.createElement('li');
        li.textContent = `داده‌های مالی برای همکاری ${collabId} با سیستم حسابداری همگام‌سازی شد.`;
        notificationsList.insertBefore(li, notificationsList.firstChild);
        setTimeout(() => {
            li.classList.add('visible');
        }, 100);
    }

    // اتصال رویداد برای دکمه همگام‌سازی
    document.querySelector('.sync-accounting-btn').addEventListener('click', () => {
        const collabId = document.querySelector('.details-btn').getAttribute('data-id');
        syncWithAccountingSystem(collabId);
    });

    // --- امکانات جدید: مدیریت فاکتورها ---

    // تابع برای تولید فاکتور
    function generateInvoice(collabId) {
        const payments = JSON.parse(localStorage.getItem(`payments_${collabId}`)) || [];
        const companyCode = document.querySelector('.company-code')?.textContent;
        const companyData = JSON.parse(localStorage.getItem(`companyData_${companyCode}`));
        const collab = JSON.parse(localStorage.getItem(`collaborations_${companyCode}`))?.find(c => c.id == collabId);

        const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
        const paidAmount = payments.filter(p => p.status === 'پرداخت‌شده').reduce((sum, p) => sum + p.amount, 0);
        const remainingAmount = totalAmount - paidAmount;

        const invoiceContent = `
فاکتور همکاری (شناسه: ${collabId})
----------------------------------------
صادر شده برای: ${collab.partnerName}
توسط: ${companyData.name}
کد شرکت: ${companyData.code}
----------------------------------------
کل مبلغ: ${totalAmount.toLocaleString()} تومان
مبلغ پرداخت‌شده: ${paidAmount.toLocaleString()} تومان
مبلغ باقی‌مانده: ${remainingAmount.toLocaleString()} تومان
----------------------------------------
جزئیات پرداخت‌ها:
${payments.map(p => `شناسه: ${p.id} - مبلغ: ${p.amount.toLocaleString()} - تاریخ سررسید: ${p.dueDate} - وضعیت: ${p.status}`).join('\n')}
----------------------------------------
تاریخ صدور: ${new Date().toLocaleString('fa-IR')}
        `;

        const blob = new Blob([invoiceContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Invoice_${collabId}.txt`;
        a.click();
        window.URL.revokeObjectURL(url);

        const notificationsList = document.getElementById('notifications-list');
        const li = document.createElement('li');
        li.textContent = `فاکتور برای همکاری ${collabId} تولید و دانلود شد.`;
        notificationsList.insertBefore(li, notificationsList.firstChild);
        setTimeout(() => {
            li.classList.add('visible');
        }, 100);
    }

    // اتصال رویداد برای دکمه تولید فاکتور
    document.querySelector('.generate-invoice-btn').addEventListener('click', () => {
        const collabId = document.querySelector('.details-btn').getAttribute('data-id');
        generateInvoice(collabId);
    });

    // --- امکانات جدید: مدیریت پرداخت‌های دوره‌ای ---

    // تابع برای تنظیم پرداخت دوره‌ای
    function setupRecurringPayment(event) {
        event.preventDefault();
        const collabId = document.querySelector('.details-btn').getAttribute('data-id');
        const recurringAmount = parseInt(document.getElementById('recurring-amount').value);
        const recurringInterval = document.getElementById('recurring-interval').value;
        const recurringCount = parseInt(document.getElementById('recurring-count').value);

        if (!recurringAmount || !recurringInterval || !recurringCount) {
            document.getElementById('recurring-status').textContent = 'لطفاً تمام فیلدها را پر کنید.';
            document.getElementById('recurring-status').style.display = 'block';
            return;
        }

        const payments = JSON.parse(localStorage.getItem(`payments_${collabId}`)) || [];
        let currentDate = new Date();

        for (let i = 0; i < recurringCount; i++) {
            const payment = {
                id: payments.length + 1 + i,
                amount: recurringAmount,
                dueDate: currentDate.toLocaleDateString('fa-IR'),
                status: 'در انتظار'
            };
            payments.push(payment);

            if (recurringInterval === 'monthly') {
                currentDate.setMonth(currentDate.getMonth() + 1);
            } else if (recurringInterval === 'weekly') {
                currentDate.setDate(currentDate.getDate() + 7);
            } else if (recurringInterval === 'daily') {
                currentDate.setDate(currentDate.getDate() + 1);
            }
        }

        localStorage.setItem(`payments_${collabId}`, JSON.stringify(payments));
        document.getElementById('recurring-status').textContent = 'پرداخت دوره‌ای با موفقیت تنظیم شد.';
        document.getElementById('recurring-status').style.display = 'block';
        document.getElementById('recurring-form').reset();

        showPaymentSchedule(collabId);
        updateFinancialReport(collabId);
    }

    // اتصال رویداد برای فرم پرداخت دوره‌ای
    document.querySelector('.recurring-form').addEventListener('submit', setupRecurringPayment);

    // --- امکانات جدید: اعلان پرداخت دوره‌ای ---

    // تابع برای ارسال اعلان پرداخت‌های دوره‌ای
    function sendRecurringPaymentReminder(collabId) {
        const payments = JSON.parse(localStorage.getItem(`payments_${collabId}`)) || [];
        const notificationsList = document.getElementById('notifications-list');
        const today = new Date();

        payments.forEach(payment => {
            if (payment.status === 'در انتظار') {
                const dueDate = new Date(payment.dueDate.split('/').reverse().join('-'));
                const daysUntilDue = Math.floor((dueDate - today) / (1000 * 60 * 60 * 24));
                if (daysUntilDue === 1) {
                    const li = document.createElement('li');
                    li.textContent = `یادآوری پرداخت دوره‌ای: ${payment.amount.toLocaleString()} تومان فردا سررسید می‌شود.`;
                    notificationsList.insertBefore(li, notificationsList.firstChild);
                    setTimeout(() => {
                        li.classList.add('visible');
                    }, 100);
                }
            }
        });
    }

    // فراخوانی اعلان پرداخت‌های دوره‌ای
    setInterval(() => {
        const collabId = document.querySelector('.details-btn')?.getAttribute('data-id');
        if (collabId) {
            sendRecurringPaymentReminder(collabId);
        }
    }, 24 * 60 * 60 * 1000); // هر 24 ساعت

    // --- امکانات جدید: گزارش مالی ماهانه ---

    // تابع برای تولید گزارش مالی ماهانه
    function generateMonthlyFinancialReport(collabId) {
        const transactions = JSON.parse(localStorage.getItem(`transactions_${collabId}`)) || [];
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        const monthlyTransactions = transactions.filter(t => {
            const transactionDate = new Date(t.date.split(',')[0].split('/').reverse().join('-'));
            return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear;
        });

        const monthlyIncome = monthlyTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        const monthlyExpense = monthlyTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
        const monthlyProfitLoss = monthlyIncome - monthlyExpense;

        const reportContent = `
گزارش مالی ماهانه همکاری (شناسه: ${collabId})
----------------------------------------
ماه: ${currentMonth + 1}/${currentYear}
----------------------------------------
کل درآمد ماهانه: ${monthlyIncome.toLocaleString()} تومان
کل هزینه ماهانه: ${monthlyExpense.toLocaleString()} تومان
سود/زیان ماهانه: ${monthlyProfitLoss.toLocaleString()} تومان
----------------------------------------
جزئیات تراکنش‌ها:
${monthlyTransactions.map(t => `شناسه: ${t.id} - نوع: ${t.type === 'income' ? 'درآمد' : 'هزینه'} - مبلغ: ${t.amount.toLocaleString()} - تاریخ: ${t.date}`).join('\n')}
----------------------------------------
تاریخ گزارش: ${new Date().toLocaleString('fa-IR')}
        `;

        const blob = new Blob([reportContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Monthly_Financial_Report_${collabId}_${currentMonth + 1}_${currentYear}.txt`;
        a.click();
        window.URL.revokeObjectURL(url);

        const notificationsList = document.getElementById('notifications-list');
        const li = document.createElement('li');
        li.textContent = `گزارش مالی ماهانه برای همکاری ${collabId} تولید و دانلود شد.`;
        notificationsList.insertBefore(li, notificationsList.firstChild);
        setTimeout(() => {
            li.classList.add('visible');
        }, 100);
    }

    // اتصال رویداد برای دکمه گزارش ماهانه
    document.querySelector('.generate-monthly-report-btn').addEventListener('click', () => {
        const collabId = document.querySelector('.details-btn').getAttribute('data-id');
        generateMonthlyFinancialReport(collabId);
    });

    // --- امکانات جدید: مدیریت تخفیف مالی ---

    // تابع برای اعمال تخفیف روی پرداخت‌ها
    function applyDiscount(event) {
        event.preventDefault();
        const collabId = document.querySelector('.details-btn').getAttribute('data-id');
        const discountPercentage = parseFloat(document.getElementById('discount-percentage').value);
        const discountDescription = document.getElementById('discount-description').value.trim();

        if (!discountPercentage || !discountDescription) {
            document.getElementById('discount-status').textContent = 'لطفاً تمام فیلدها را پر کنید.';
            document.getElementById('discount-status').style.display = 'block';
            return;
        }

        const payments = JSON.parse(localStorage.getItem(`payments_${collabId}`)) || [];
        payments.forEach(payment => {
            if (payment.status === 'در انتظار') {
                const discountAmount = payment.amount * (discountPercentage / 100);
                payment.amount -= discountAmount;

                // ثبت تخفیف به عنوان تراکنش
                recordTransaction(collabId, discountAmount, 'expense', `تخفیف: ${discountDescription} (${discountPercentage}%)`);
            }
        });

        localStorage.setItem(`payments_${collabId}`, JSON.stringify(payments));
        document.getElementById('discount-status').textContent = 'تخفیف با موفقیت اعمال شد.';
        document.getElementById('discount-status').style.display = 'block';
        document.getElementById('discount-form').reset();

        showPaymentSchedule(collabId);
        updateFinancialReport(collabId);
    }

    // اتصال رویداد برای فرم تخفیف
    document.querySelector('.discount-form').addEventListener('submit', applyDiscount);

    // --- امکانات جدید: مدیریت پرداخت‌های گروهی ---

    // تابع برای پرداخت گروهی
    function batchPayment(event) {
        event.preventDefault();
        const collabId = document.querySelector('.details-btn').getAttribute('data-id');
        const paymentIds = document.getElementById('batch-payment-ids').value.split(',').map(id => parseInt(id.trim()));

        const payments = JSON.parse(localStorage.getItem(`payments_${collabId}`)) || [];
        let totalBatchAmount = 0;

        paymentIds.forEach(paymentId => {
            const payment = payments.find(p => p.id === paymentId && p.status === 'در انتظار');
            if (payment) {
                payment.status = 'پرداخت‌شده';
                totalBatchAmount += payment.amount;
            }
        });

        if (totalBatchAmount > 0) {
            recordTransaction(collabId, totalBatchAmount, 'income', 'پرداخت گروهی');
            localStorage.setItem(`payments_${collabId}`, JSON.stringify(payments));
            document.getElementById('batch-payment-status').textContent = `پرداخت گروهی به مبلغ ${totalBatchAmount.toLocaleString()} تومان با موفقیت انجام شد.`;
            document.getElementById('batch-payment-status').style.display = 'block';
        } else {
            document.getElementById('batch-payment-status').textContent = 'هیچ پرداختی برای این شناسه‌ها یافت نشد.';
            document.getElementById('batch-payment-status').style.display = 'block';
        }

        document.getElementById('batch-payment-form').reset();
        showPaymentSchedule(collabId);
        updateFinancialReport(collabId);
    }

    // اتصال رویداد برای فرم پرداخت گروهی
    document.querySelector('.batch-payment-form').addEventListener('submit', batchPayment);

    // --- امکانات جدید: گزارش مالی سالانه ---

    // تابع برای تولید گزارش مالی سالانه
    function generateAnnualFinancialReport(collabId) {
        const transactions = JSON.parse(localStorage.getItem(`transactions_${collabId}`)) || [];
        const currentYear = new Date().getFullYear();

        const annualTransactions = transactions.filter(t => {
            const transactionDate = new Date(t.date.split(',')[0].split('/').reverse().join('-'));
            return transactionDate.getFullYear() === currentYear;
        });

        const annualIncome = annualTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        const annualExpense = annualTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
        const annualProfitLoss = annualIncome - annualExpense;

        const reportContent = `
گزارش مالی سالانه همکاری (شناسه: ${collabId})
----------------------------------------
سال: ${currentYear}
----------------------------------------
کل درآمد سالانه: ${annualIncome.toLocaleString()} تومان
کل هزینه سالانه: ${annualExpense.toLocaleString()} تومان
سود/زیان سالانه: ${annualProfitLoss.toLocaleString()} تومان
----------------------------------------
جزئیات تراکنش‌ها:
${annualTransactions.map(t => `شناسه: ${t.id} - نوع: ${t.type === 'income' ? 'درآمد' : 'هزینه'} - مبلغ: ${t.amount.toLocaleString()} - تاریخ: ${t.date}`).join('\n')}
----------------------------------------
تاریخ گزارش: ${new Date().toLocaleString('fa-IR')}
        `;

        const blob = new Blob([reportContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Annual_Financial_Report_${collabId}_${currentYear}.txt`;
        a.click();
        window.URL.revokeObjectURL(url);

        const notificationsList = document.getElementById('notifications-list');
        const li = document.createElement('li');
        li.textContent = `گزارش مالی سالانه برای همکاری ${collabId} تولید و دانلود شد.`;
        notificationsList.insertBefore(li, notificationsList.firstChild);
        setTimeout(() => {
            li.classList.add('visible');
        }, 100);
    }

    // اتصال رویداد برای دکمه گزارش سالانه
    document.querySelector('.generate-annual-report-btn').addEventListener('click', () => {
        const collabId = document.querySelector('.details-btn').getAttribute('data-id');
        generateAnnualFinancialReport(collabId);
    });

    // --- امکانات جدید: مدیریت پرداخت‌های شرطی ---

    // تابع برای تنظیم پرداخت شرطی
    function setupConditionalPayment(event) {
        event.preventDefault();
        const collabId = document.querySelector('.details-btn').getAttribute('data-id');
        const conditionalAmount = parseInt(document.getElementById('conditional-amount').value);
        const conditionDescription = document.getElementById('condition-description').value.trim();

        if (!conditionalAmount || !conditionDescription) {
            document.getElementById('conditional-status').textContent = 'لطفاً تمام فیلدها را پر کنید.';
            document.getElementById('conditional-status').style.display = 'block';
            return;
        }

        const conditionalPayment = {
            id: Date.now(),
            amount: conditionalAmount,
            condition: conditionDescription,
            status: 'در انتظار شرط',
            date: new Date().toLocaleString('fa-IR')
        };

        const conditionalPayments = JSON.parse(localStorage.getItem(`conditionalPayments_${collabId}`)) || [];
        conditionalPayments.push(conditionalPayment);
        localStorage.setItem(`conditionalPayments_${collabId}`, JSON.stringify(conditionalPayments));

        document.getElementById('conditional-status').textContent = 'پرداخت شرطی با موفقیت تنظیم شد.';
        document.getElementById('conditional-status').style.display = 'block';
        document.getElementById('conditional-form').reset();

        showConditionalPayments(collabId);
    }

    // تابع برای نمایش پرداخت‌های شرطی
    function showConditionalPayments(collabId) {
        const tableBody = document.getElementById('conditional-payments-table-body');
        tableBody.innerHTML = '';

        const conditionalPayments = JSON.parse(localStorage.getItem(`conditionalPayments_${collabId}`)) || [];
        if (conditionalPayments.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5">پرداخت شرطی ثبت نشده است.</td></tr>';
            return;
        }

        conditionalPayments.forEach(payment => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${payment.id}</td>
                <td>${payment.amount.toLocaleString()}</td>
                <td>${payment.condition}</td>
                <td>${payment.status}</td>
                <td>${
                    payment.status === 'در انتظار شرط' ?
                    `<button class="btn" onclick="fulfillCondition('${collabId}', ${payment.id})">تایید شرط</button>` :
                    ''
                }</td>
            `;
            tableBody.appendChild(tr);
        });
    }

    // تابع برای تایید شرط و تبدیل به پرداخت عادی
    function fulfillCondition(collabId, paymentId) {
        const conditionalPayments = JSON.parse(localStorage.getItem(`conditionalPayments_${collabId}`)) || [];
        const payment = conditionalPayments.find(p => p.id === paymentId);
        if (payment) {
            payment.status = 'تایید شده';
            localStorage.setItem(`conditionalPayments_${collabId}`, JSON.stringify(conditionalPayments));

            const payments = JSON.parse(localStorage.getItem(`payments_${collabId}`)) || [];
            const newPayment = {
                id: payments.length + 1,
                amount: payment.amount,
                dueDate: new Date().toLocaleDateString('fa-IR'),
                status: 'در انتظار'
            };
            payments.push(newPayment);
            localStorage.setItem(`payments_${collabId}`, JSON.stringify(payments));

            showConditionalPayments(collabId);
            showPaymentSchedule(collabId);
            updateFinancialReport(collabId);
        }
    }

    // اتصال رویداد برای فرم پرداخت شرطی
    document.querySelector('.conditional-form').addEventListener('submit', setupConditionalPayment);

    // --- امکانات جدید: مدیریت وام ---

    // تابع برای ثبت درخواست وام
    function requestLoan(event) {
        event.preventDefault();
        const collabId = document.querySelector('.details-btn').getAttribute('data-id');
        const loanAmount = parseInt(document.getElementById('loan-amount').value);
        const loanDescription = document.getElementById('loan-description').value.trim();

        if (!loanAmount || !loanDescription) {
            document.getElementById('loan-status').textContent = 'لطفاً تمام فیلدها را پر کنید.';
            document.getElementById('loan-status').style.display = 'block';
            return;
        }

        const loan = {
            id: Date.now(),
            amount: loanAmount,
            description: loanDescription,
            status: 'در انتظار تایید',
            date: new Date().toLocaleString('fa-IR')
        };

        const loans = JSON.parse(localStorage.getItem(`loans_${collabId}`)) || [];
        loans.push(loan);
        localStorage.setItem(`loans_${collabId}`, JSON.stringify(loans));

        document.getElementById('loan-status').textContent = 'درخواست وام با موفقیت ثبت شد.';
        document.getElementById('loan-status').style.display = 'block';
        document.getElementById('loan-form').reset();

        showLoans(collabId);

        // شبیه‌سازی پاسخ خودکار
        setTimeout(() => {
            const updatedLoans = JSON.parse(localStorage.getItem(`loans_${collabId}`)) || [];
            const loanIndex = updatedLoans.findIndex(l => l.id === loan.id);
            if (loanIndex !== -1) {
                updatedLoans[loanIndex].status = Math.random() > 0.5 ? 'تایید شده' : 'رد شده';
                localStorage.setItem(`loans_${collabId}`, JSON.stringify(updatedLoans));

                const notificationsList = document.getElementById('notifications-list');
                const li = document.createElement('li');
                li.textContent = `درخواست وام شما (${loan.amount.toLocaleString()} تومان) ${updatedLoans[loanIndex].status}.`;
                notificationsList.insertBefore(li, notificationsList.firstChild);
                setTimeout(() => {
                    li.classList.add('visible');
                }, 100);

                if (updatedLoans[loanIndex].status === 'تایید شده') {
                    recordTransaction(collabId, loan.amount, 'income', 'دریافت وام');
                    updateFinancialReport(collabId);
                }

                showLoans(collabId);
            }
        }, 3000);
    }

    // تابع برای نمایش وام‌ها
    function showLoans(collabId) {
        const tableBody = document.getElementById('loans-table-body');
        tableBody.innerHTML = '';

        const loans = JSON.parse(localStorage.getItem(`loans_${collabId}`)) || [];
        if (loans.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="4">وامی ثبت نشده است.</td></tr>';
            return;
        }

        loans.forEach(loan => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${loan.id}</td>
                <td>${loan.amount.toLocaleString()}</td>
                <td>${loan.description}</td>
                <td>${loan.status}</td>
            `;
            tableBody.appendChild(tr);
        });
    }

    // اتصال رویداد برای فرم درخواست وام
    document.querySelector('.loan-form').addEventListener('submit', requestLoan);

    // --- امکانات جدید: مدیریت بازپرداخت وام ---

    // تابع برای تنظیم بازپرداخت وام
    function setupLoanRepayment(event) {
        event.preventDefault();
        const collabId = document.querySelector('.details-btn').getAttribute('data-id');
        const loanId = parseInt(document.getElementById('loan-repayment-id').value);
        const repaymentAmount = parseInt(document.getElementById('repayment-amount').value);

        const loans = JSON.parse(localStorage.getItem(`loans_${collabId}`)) || [];
        const loan = loans.find(l => l.id === loanId && l.status === 'تایید شده');

        if (!loan) {
            document.getElementById('repayment-status').textContent = 'وام معتبر یافت نشد.';
            document.getElementById('repayment-status').style.display = 'block';
            return;
        }

        if (repaymentAmount > loan.amount) {
            document.getElementById('repayment-status').textContent = 'مبلغ بازپرداخت نمی‌تواند بیشتر از مبلغ وام باشد.';
            document.getElementById('repayment-status').style.display = 'block';
            return;
        }

        recordTransaction(collabId, repaymentAmount, 'expense', `بازپرداخت وام (${loanId})`);
        loan.amount -= repaymentAmount;

        if (loan.amount <= 0) {
            loan.status = 'بازپرداخت شده';
        }

        localStorage.setItem(`loans_${collabId}`, JSON.stringify(loans));
        document.getElementById('repayment-status').textContent = 'بازپرداخت وام با موفقیت انجام شد.';
        document.getElementById('repayment-status').style.display = 'block';
        document.getElementById('repayment-form').reset();

        showLoans(collabId);
        updateFinancialReport(collabId);
    }

    // اتصال رویداد برای فرم بازپرداخت وام
    document.querySelector('.repayment-form').addEventListener('submit', setupLoanRepayment);

    // --- امکانات جدید: گزارش وام‌ها ---

    // تابع برای تولید گزارش وام‌ها
    function generateLoanReport(collabId) {
        const loans = JSON.parse(localStorage.getItem(`loans_${collabId}`)) || [];
        const totalLoanAmount = loans.reduce((sum, l) => sum + l.amount, 0);
        const repaidLoans = loans.filter(l => l.status === 'بازپرداخت شده');
        const totalRepaidAmount = loans.reduce((sum, l) => l.status === 'بازپرداخت شده' ? sum + l.amount : sum, 0);

        const reportContent = `
گزارش وام‌های همکاری (شناسه: ${collabId})
----------------------------------------
کل مبلغ وام‌ها: ${totalLoanAmount.toLocaleString()} تومان
تعداد وام‌های بازپرداخت‌شده: ${repaidLoans.length}
مبلغ بازپرداخت‌شده: ${totalRepaidAmount.toLocaleString()} تومان
----------------------------------------
جزئیات وام‌ها:
${loans.map(l => `شناسه: ${l.id} - مبلغ: ${l.amount.toLocaleString()} - توضیحات: ${l.description} - وضعیت: ${l.status} - تاریخ: ${l.date}`).join('\n')}
----------------------------------------
تاریخ گزارش: ${new Date().toLocaleString('fa-IR')}
        `;

        const blob = new Blob([reportContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Loan_Report_${collabId}.txt`;
        a.click();
        window.URL.revokeObjectURL(url);

        const notificationsList = document.getElementById('notifications-list');
        const li = document.createElement('li');
        li.textContent = `گزارش وام‌ها برای همکاری ${collabId} تولید و دانلود شد.`;
        notificationsList.insertBefore(li, notificationsList.firstChild);
        setTimeout(() => {
            li.classList.add('visible');
        }, 100);
    }

    // اتصال رویداد برای دکمه گزارش وام‌ها
    document.querySelector('.generate-loan-report-btn').addEventListener('click', () => {
        const collabId = document.querySelector('.details-btn').getAttribute('data-id');
        generateLoanReport(collabId);
    });

    // --- امکانات جدید: اعلان وام ---

    // تابع برای ارسال اعلان وام
    function sendLoanReminder(collabId) {
        const loans = JSON.parse(localStorage.getItem(`loans_${collabId}`)) || [];
        const notificationsList = document.getElementById('notifications-list');

        loans.forEach(loan => {
            if (loan.status === 'تایید شده' && loan.amount > 0) {
                const li = document.createElement('li');
                li.textContent = `یادآوری: وام (${loan.id}) به مبلغ ${loan.amount.toLocaleString()} تومان نیاز به بازپرداخت دارد.`;
                notificationsList.insertBefore(li, notificationsList.firstChild);
                setTimeout(() => {
                    li.classList.add('visible');
                }, 100);
            }
        });
    }

    // فراخوانی اعلان وام‌ها
    setInterval(() => {
        const collabId = document.querySelector('.details-btn')?.getAttribute('data-id');
        if (collabId) {
            sendLoanReminder(collabId);
        }
    }, 24 * 60 * 60 * 1000); // هر 24 ساعت

    // --- امکانات جدید: مدیریت سود وام ---

    // تابع برای محاسبه سود وام
    function calculateLoanInterest(collabId) {
        const loans = JSON.parse(localStorage.getItem(`loans_${collabId}`)) || [];
        let totalInterest = 0;
        const interestRate = 0.05; // نرخ سود 5%

        loans.forEach(loan => {
            if (loan.status === 'تایید شده' && loan.amount > 0) {
                const interest = loan.amount * interestRate;
                totalInterest += interest;
            }
        });

        document.getElementById('loan-interest').textContent = totalInterest.toLocaleString();
    }

    // تابع برای به‌روزرسانی سود وام
    function updateLoanInterest(collabId) {
        calculateLoanInterest(collabId);
    }

    // اتصال رویداد برای دکمه به‌روزرسانی سود وام
    document.querySelector('.update-loan-interest-btn').addEventListener('click', () => {
        const collabId = document.querySelector('.details-btn').getAttribute('data-id');
        updateLoanInterest(collabId);
    });

    // --- امکانات جدید: داشبورد وام ---

    // تابع برای لود داشبورد وام
    function loadLoanDashboard(collabId) {
        showLoans(collabId);
        updateLoanInterest(collabId);
        sendLoanReminder(collabId);
    }

    // فراخوانی داشبورد وام هنگام باز کردن جزئیات همکاری
    document.querySelectorAll('.details-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const collabId = btn.getAttribute('data-id');
            loadLoanDashboard(collabId);
        });
    });

    // --- پایان کد ---
