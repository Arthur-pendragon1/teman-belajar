// Data Dummy Siswa (Simulasi Database)
// Menggunakan localStorage agar data tidak hilang saat refresh
let students = JSON.parse(localStorage.getItem('students')) || [
    { id: 1, name: "Budi Santoso", class: "Matematika Dasar", status: "Aktif" },
    { id: 2, name: "Siti Aminah", class: "Bahasa Inggris", status: "Aktif" },
    { id: 3, name: "Joko Anwar", class: "Fisika", status: "Cuti" }
];

// Fungsi untuk menyimpan data ke localStorage
function saveToLocalStorage() {
    localStorage.setItem('students', JSON.stringify(students));
}

// --- FUNGSI LOGIN ---
const loginForm = document.getElementById('loginForm');
const loginPage = document.getElementById('loginPage');
const dashboardPage = document.getElementById('dashboardPage');
const userNameDisplay = document.getElementById('userNameDisplay');

const btnLogin = document.querySelector('.login-btn');
const btnText = document.getElementById('btnText');
const loading = document.getElementById('loading');

loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    // Tampilkan loading kecil di tombol
    btnLogin.disabled = true;
    btnText.style.display = 'none';
    loading.style.display = 'block';

    setTimeout(() => {
        if (user === 'admin' && pass === '1234') {
            loginPage.style.display = 'none';
            dashboardPage.style.display = 'flex';
            userNameDisplay.innerText = "Administrator";
            renderStudents(); // Load data saat login
        } else if (user === 'user' && pass === '1234') {
            loginPage.style.display = 'none';
            dashboardPage.style.display = 'flex';
            userNameDisplay.innerText = "User (Siswa)";
            alert("Selamat datang User! Anda hanya bisa melihat data.");
            // Sembunyikan fitur admin untuk user
            document.querySelector('.btn-add').style.display = 'none';
        } else {
            alert("Username atau Password salah!");
        }

        // Reset tombol kembali
        btnLogin.disabled = false;
        btnText.style.display = 'block';
        loading.style.display = 'none';
    }, 800);
});

// Toggle visibility password
const passwordField = document.getElementById('password');
const passwordIcon = document.querySelector('.password-group i');

if (passwordField && passwordIcon) {
    passwordIcon.style.cursor = 'pointer';
    passwordIcon.addEventListener('click', function() {
        const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordField.setAttribute('type', type);
        passwordIcon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
    });
}

function logout() {
    dashboardPage.style.display = 'none';
    loginPage.style.display = 'flex';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';

    // Reset tombol login & loading
    btnLogin.disabled = false;
    btnText.style.display = 'block';
    loading.style.display = 'none';

    // Reset password visibility icon
    if (passwordIcon) {
        passwordIcon.className = 'fas fa-eye';
        passwordField.setAttribute('type', 'password');
    }

    // Tampilkan kembali tombol tambah untuk admin saat login ulang
    document.querySelector('.btn-add').style.display = 'inline-block';
}

// --- FUNGSI NAVIGASI ---
function showSection(sectionId) {
    // Sembunyikan semua section
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(sec => sec.style.display = 'none');

    // Tampilkan section yang dipilih
    document.getElementById(sectionId).style.display = 'block';

    // Update judul header
    const titles = {
        'students': 'Data Siswa',
        'attendance': 'Absensi Siswa',
        'payments': 'Pembayaran SPP'
    };
    document.getElementById('pageTitle').innerText = titles[sectionId];

    // Load data sesuai section
    if (sectionId === 'attendance') {
        renderAttendance();
    } else if (sectionId === 'payments') {
        renderPayments();
    }

    // Highlight menu sidebar
    const menuItems = document.querySelectorAll('.sidebar nav ul li');
    menuItems.forEach(item => item.classList.remove('active'));
    event.currentTarget.classList.add('active');
}

// --- FUNGSI DATA SISWA (CRUD) ---
function renderStudents() {
    const tableBody = document.getElementById('studentTableBody');
    tableBody.innerHTML = ''; // Clear existing data

    students.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.name}</td>
            <td>${student.class}</td>
            <td><span class="status-${student.status === 'Aktif' ? 'paid' : 'unpaid'}">${student.status}</span></td>
            <td>
                <button class="btn-delete" onclick="deleteStudent(${student.id})"><i class="fas fa-trash"></i> Hapus</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// --- FUNGSI MODAL ---
function openModal() {
    document.getElementById('addStudentModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('addStudentModal').style.display = 'none';
    document.getElementById('addStudentForm').reset();
}

// --- FUNGSI TAMBAH SISWA ---
document.getElementById('addStudentForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('newStudentName').value;
    const className = document.getElementById('newStudentClass').value;

    // Generate new ID
    const newId = students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1;

    // Add new student
    const newStudent = {
        id: newId,
        name: name,
        class: className,
        status: "Aktif"
    };

    students.push(newStudent);
    saveToLocalStorage(); // Simpan ke localStorage
    renderStudents(); // Re-render table
    closeModal(); // Close modal
    alert("Siswa baru berhasil ditambahkan!");
});

// --- FUNGSI HAPUS SISWA ---
function deleteStudent(id) {
    if (confirm("Apakah Anda yakin ingin menghapus siswa ini?")) {
        students = students.filter(student => student.id !== id);
        saveToLocalStorage(); // Simpan ke localStorage
        
        // Hapus juga data absensi siswa dari localStorage
        const attendanceRaw = JSON.parse(localStorage.getItem('attendance')) || {};
        Object.keys(attendanceRaw).forEach(dateKey => {
            if (attendanceRaw[dateKey] && attendanceRaw[dateKey][id]) {
                delete attendanceRaw[dateKey][id];
            }
        });
        localStorage.setItem('attendance', JSON.stringify(attendanceRaw));
        
        // Hapus juga data pembayaran siswa dari localStorage
        let payments = JSON.parse(localStorage.getItem('payments')) || [];
        payments = payments.filter(payment => payment.studentId !== id);
        localStorage.setItem('payments', JSON.stringify(payments));
        
        renderStudents();
        alert('Siswa berhasil dihapus! (Data absensi dan pembayaran juga dihapus)');
    }
}

// Tutup modal jika klik di luar area modal
window.onclick = function(event) {
    const modal = document.getElementById('addStudentModal');
    const paymentModal = document.getElementById('paymentModal');
    if (event.target === modal) {
        closeModal();
    }
    if (event.target === paymentModal) {
        closePaymentModal();
    }
};

// ==================== FITUR ABSENSI ====================
// Data absensi menggunakan localStorage
let attendanceData = JSON.parse(localStorage.getItem('attendance')) || {};

// Tampilkan tanggal hari ini
const today = new Date();
const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
document.getElementById('currentDate').innerText = today.toLocaleDateString('id-ID', options);

// Fungsi untuk mendapatkan waktu saat ini dari perangkat
function getCurrentDeviceTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}

// Update jam secara real-time
function updateClock() {
    const timeDisplay = document.getElementById('currentTime');
    if (timeDisplay) {
        timeDisplay.innerText = `Jam: ${getCurrentDeviceTime()}`;
    }
}

// Update jam setiap detik
setInterval(updateClock, 1000);
updateClock(); // Initial call

// Render absensi berdasarkan data siswa
function renderAttendance() {
    const attendanceList = document.getElementById('attendanceList');
    attendanceList.innerHTML = '';

    students.forEach(student => {
        const dateKey = today.toISOString().split('T')[0];
        const studentAttendance = attendanceData[dateKey] && attendanceData[dateKey][student.id];
        const isPresent = studentAttendance ? studentAttendance.present : false;
        const statusText = isPresent ? 'Hadir' : 'Tidak Hadir';

        const item = document.createElement('div');
        item.className = 'attendance-item';
        item.innerHTML = `
            <div class="student-info">
                <span class="student-name">${student.name}</span>
                <span class="student-time">${statusText}</span>
            </div>
            <label class="switch">
                <input type="checkbox" id="att-${student.id}" ${isPresent ? 'checked' : ''} onchange="toggleAttendance(${student.id})">
                <span class="slider"></span>
            </label>
        `;
        attendanceList.appendChild(item);
    });
}

// Fungsi untuk toggle checkbox absensi manual
function toggleAttendance(studentId) {
    const checkbox = document.getElementById(`att-${studentId}`);
    const isChecked = checkbox.checked;
    const dateKey = today.toISOString().split('T')[0];
    
    if (!attendanceData[dateKey]) {
        attendanceData[dateKey] = {};
    }
    
    attendanceData[dateKey][studentId] = {
        present: isChecked
    };
    
    localStorage.setItem('attendance', JSON.stringify(attendanceData));
}

// Fungsi untuk menandai semua siswa hadir
function setAllPresent() {
    const dateKey = today.toISOString().split('T')[0];

    if (!attendanceData[dateKey]) {
        attendanceData[dateKey] = {};
    }

    students.forEach(student => {
        attendanceData[dateKey][student.id] = { present: true };

        const checkbox = document.getElementById(`att-${student.id}`);
        if (checkbox) {
            checkbox.checked = true;
        }
    });

    localStorage.setItem('attendance', JSON.stringify(attendanceData));
    renderAttendance();
    alert('Semua siswa ditandai hadir!');
}

// Fungsi untuk mereset absensi
function clearAllAttendance() {
    const dateKey = today.toISOString().split('T')[0];

    if (!attendanceData[dateKey]) {
        attendanceData[dateKey] = {};
    }

    students.forEach(student => {
        attendanceData[dateKey][student.id] = { present: false };

        const checkbox = document.getElementById(`att-${student.id}`);
        if (checkbox) {
            checkbox.checked = false;
        }
    });

    localStorage.setItem('attendance', JSON.stringify(attendanceData));
    renderAttendance();
    alert('Absensi telah dikosongkan.');
}

// Simpan absensi ke localStorage
function saveAttendance() {
    const dateKey = today.toISOString().split('T')[0];
    
    if (!attendanceData[dateKey]) {
        attendanceData[dateKey] = {};
    }

    students.forEach(student => {
        const checkbox = document.getElementById(`att-${student.id}`);
        attendanceData[dateKey][student.id] = {
            present: checkbox.checked
        };
    });

    localStorage.setItem('attendance', JSON.stringify(attendanceData));
    alert('Absensi berhasil disimpan!');
}

// ==================== FITUR PEMBAYARAN SPP ====================
let payments = JSON.parse(localStorage.getItem('payments')) || [
    { id: 1, studentId: 1, studentName: "Budi Santoso", month: "Oktober", amount: 150000, status: "Lunas" },
    { id: 2, studentId: 2, studentName: "Siti Aminah", month: "Oktober", amount: 150000, status: "Belum Bayar" }
];

// Render dropdown siswa di modal pembayaran
function renderPaymentStudentOptions() {
    const select = document.getElementById('paymentStudent');
    select.innerHTML = '<option value="">Pilih Siswa</option>';
    
    students.forEach(student => {
        const option = document.createElement('option');
        option.value = student.id;
        option.textContent = student.name;
        select.appendChild(option);
    });
}

// Render tabel pembayaran
function renderPayments() {
    const tableBody = document.getElementById('paymentTableBody');
    const filterMonth = document.getElementById('filterMonth').value;
    tableBody.innerHTML = '';

    let filteredPayments = payments;
    if (filterMonth) {
        filteredPayments = payments.filter(p => p.month === filterMonth);
    }

    filteredPayments.forEach(payment => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${payment.studentName}</td>
            <td>${payment.month}</td>
            <td>Rp ${payment.amount.toLocaleString('id-ID')}</td>
            <td><span class="status-${payment.status === 'Lunas' ? 'paid' : 'unpaid'}">${payment.status}</span></td>
            <td>
                ${payment.status === 'Belum Bayar' 
                    ? `<button class="btn-add" onclick="markAsPaid(${payment.id})"><i class="fas fa-check"></i> Bayar</button>` 
                    : `<button class="btn-delete" onclick="deletePayment(${payment.id})"><i class="fas fa-trash"></i> Hapus</button>`}
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Buka modal pembayaran
function openPaymentModal() {
    renderPaymentStudentOptions();
    document.getElementById('paymentModal').style.display = 'block';
}

// Tutup modal pembayaran
function closePaymentModal() {
    document.getElementById('paymentModal').style.display = 'none';
    document.getElementById('paymentForm').reset();
}

// Tambah pembayaran baru
document.getElementById('paymentForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const studentId = parseInt(document.getElementById('paymentStudent').value);
    const studentName = students.find(s => s.id === studentId).name;
    const month = document.getElementById('paymentMonth').value;
    const amount = parseInt(document.getElementById('paymentAmount').value);

    const existingPayment = payments.find(p => p.studentId === studentId && p.month === month);
    
    if (existingPayment) {
        alert('Pembayaran untuk siswa ini pada bulan tersebut sudah ada!');
        return;
    }

    const newPayment = {
        id: payments.length > 0 ? Math.max(...payments.map(p => p.id)) + 1 : 1,
        studentId: studentId,
        studentName: studentName,
        month: month,
        amount: amount,
        status: "Lunas"
    };

    payments.push(newPayment);
    localStorage.setItem('payments', JSON.stringify(payments));
    renderPayments();
    closePaymentModal();
    alert('Pembayaran berhasil disimpan!');
});

// Tandai sebagai lunas
function markAsPaid(paymentId) {
    const payment = payments.find(p => p.id === paymentId);
    if (payment) {
        payment.status = "Lunas";
        localStorage.setItem('payments', JSON.stringify(payments));
        renderPayments();
        alert('Pembayaran berhasil ditandai lunas!');
    }
}

// Hapus pembayaran
function deletePayment(paymentId) {
    if (confirm('Apakah Anda yakin ingin menghapus pembayaran ini?')) {
        payments = payments.filter(p => p.id !== paymentId);
        localStorage.setItem('payments', JSON.stringify(payments));
        renderPayments();
        alert('Pembayaran berhasil dihapus!');
    }
}

// ==================== EXCEL EXPORT FUNCTIONS ====================

// Fungsi untuk export Absensi ke Excel
function exportAttendanceToExcel() {
    // Ambil semua data absensi dari localStorage
    const attendanceRaw = JSON.parse(localStorage.getItem('attendance')) || {};
    
    // Format data untuk Excel
    const exportData = [];
    
    // Loop melalui semua tanggal
    Object.keys(attendanceRaw).forEach(dateKey => {
        const dateData = attendanceRaw[dateKey];
        students.forEach(student => {
            const studentData = dateData[student.id];
            if (studentData && studentData.present) {
                exportData.push({
                    'Tanggal': formatDate(dateKey),
                    'Nama Siswa': student.name,
                    'Kelas': student.class,
                    'Status': studentData.present ? 'Hadir' : 'Tidak Hadir'
                });
            }
        });
    });

    if (exportData.length === 0) {
        alert('Tidak ada data absensi untuk di-export!');
        return;
    }

    // Buat worksheet
    const ws = XLSX.utils.json_to_sheet(exportData);
    
    // Atur lebar kolom otomatis
    const colWidths = [
        { wch: 15 }, // Tanggal
        { wch: 25 }, // Nama Siswa
        { wch: 20 }, // Kelas
        { wch: 12 }  // Status
    ];
    ws['!cols'] = colWidths;

    // Buat workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Absensi");

    // Generate filename dengan timestamp
    const fileName = `Data_Absensi_${getCurrentDateString()}.xlsx`;
    
    // Download file
    XLSX.writeFile(wb, fileName);
    alert('Data absensi berhasil di-export ke Excel!');
}

// Fungsi untuk export Pembayaran ke Excel
function exportPaymentsToExcel() {
    if (payments.length === 0) {
        alert('Tidak ada data pembayaran untuk di-export!');
        return;
    }

    // Format data untuk Excel
    const exportData = payments.map(payment => ({
        'Nama Siswa': payment.studentName,
        'Bulan': payment.month,
        'Jumlah (Rp)': payment.amount,
        'Status': payment.status,
        'Tanggal Export': getCurrentDateString()
    }));

    // Buat worksheet
    const ws = XLSX.utils.json_to_sheet(exportData);
    
    // Atur lebar kolom otomatis
    const colWidths = [
        { wch: 25 }, // Nama Siswa
        { wch: 15 }, // Bulan
        { wch: 15 }, // Jumlah
        { wch: 12 }, // Status
        { wch: 15 }  // Tanggal Export
    ];
    ws['!cols'] = colWidths;

    // Buat workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Pembayaran");

    // Generate filename
    const fileName = `Data_Pembayaran_${getCurrentDateString()}.xlsx`;
    
    // Download file
    XLSX.writeFile(wb, fileName);
    alert('Data pembayaran berhasil di-export ke Excel!');
}

// Fungsi helper untuk format tanggal
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

// Fungsi untuk mendapatkan string tanggal saat ini
function getCurrentDateString() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    return `${day}-${month}-${year}`;
}
