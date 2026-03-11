const cities = ["القاهرة", "الإسكندرية", "الجيزة", "القليوبية", "الدقهلية", "الغربية", "الشرقية", "المنوفية", "البحيرة", "كفر الشيخ", "دمياط", "بورسعيد", "الإسماعيلية", "السويس", "الفيوم", "بني سويف", "المنيا", "أسيوط", "سوهاج", "قنا", "الأقصر", "أسوان"];

function saveBasicInfoAndNext() {
    const roleInput = document.querySelector('input[name="role"]:checked');
    const basicInfo = {
        name: document.getElementById('regName').value,
        email: document.getElementById('regEmail').value,
        phone: document.getElementById('regPhone').value,
        role: roleInput ? roleInput.value : 'student'
    };
    
    if(!basicInfo.name || !basicInfo.phone) {
        alert("برجاء ملء البيانات الأساسية أولاً");
        return;
    }

    // حفظ البيانات مؤقتاً لنقلها للصفحة التالية
    localStorage.setItem('tempUser', JSON.stringify(basicInfo));
    window.location.href = basicInfo.role === 'student' ? 'student.html' : 'teacher.html';
}

function handleModeChange(val, divId) {
    const div = document.getElementById(divId);
    if(val === 'offline' || val === 'yes') {
        div.style.display = 'block';
        const cityList = div.querySelector('.city-list');
        if(cityList && cityList.options.length <= 1) {
            cities.forEach(c => cityList.add(new Option(c, c)));
        }
    } else {
        div.style.display = 'none';
    }
}

// دالة الإرسال الأونلاين (قاعدة البيانات السحابية)
async function submitToAdmin(event) {
    event.preventDefault();
    const btn = event.target.querySelector('button');
    btn.innerText = "جاري الإرسال...";
    btn.disabled = true;

    const basicData = JSON.parse(localStorage.getItem('tempUser') || '{}');
    const formData = new FormData(event.target);
    // تجميع بيانات الصفحة الأولى مع بيانات الصفحة الحالية
    const finalData = { ...basicData, ...Object.fromEntries(formData) };

    try {
        const response = await fetch('https://formspree.io/f/mvzwavlj', {
            method: 'POST',
            body: JSON.stringify(finalData),
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            alert("تم إرسال طلبك بنجاح للأدمن! ستصلك البيانات على الإيميل.");
            localStorage.removeItem('tempUser');
            window.location.href = 'index.html';
        } else {
            alert("حدث خطأ في الخادم، حاول مرة أخرى.");
        }
    } catch (error) {
        alert("تأكد من اتصالك بالإنترنت.");
    } finally {
        btn.innerText = "إرسال البيانات";
        btn.disabled = false;
    }
}