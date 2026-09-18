/* =============================================================================
   js/auth-guard.js — Kiểm tra đăng nhập, chuyển hướng về login nếu chưa đăng nhập
   ============================================================================= */
import { auth } from './firebase-config.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import { db } from './firebase-config.js';

// Danh sách các trang không yêu cầu đăng nhập
const PUBLIC_PAGES = ['login.html'];

// Kiểm tra xem trang hiện tại có phải là trang công khai không
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
const isPublicPage = PUBLIC_PAGES.includes(currentPage);

// Nếu đang ở trang login và đã đăng nhập thì chuyển hướng về index
onAuthStateChanged(auth, async (user) => {
    if (isPublicPage && currentPage === 'login.html') {
        if (user) {
            // Đã đăng nhập mà vẫn ở trang login -> chuyển về index hoặc returnUrl
            const permissionCheck = await checkUserPermission(user.uid);
            if (permissionCheck.allowed) {
                // Kiểm tra xem có returnUrl không
                const urlParams = new URLSearchParams(window.location.search);
                const returnUrl = urlParams.get('returnUrl');
                
                if (returnUrl) {
                    // Redirect về trang người dùng đang cố truy cập
                    window.location.href = decodeURIComponent(returnUrl);
                } else {
                    // Không có returnUrl thì về index
                    window.location.replace('index.html');
                }
            } else {
                // Không có quyền -> đăng xuất
                const { signOut } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js');
                await signOut(auth);
            }
        }
        // Nếu chưa đăng nhập thì cứ ở trang login
        return;
    }

    // Nếu không phải trang login hoặc trang công khai
    if (!isPublicPage) {
        if (!user) {
            // Chưa đăng nhập -> chuyển về login, lưu lại URL để redirect sau
            const currentPath = window.location.pathname + window.location.search;
            const returnUrl = encodeURIComponent(currentPath);
            window.location.href = `login.html?returnUrl=${returnUrl}`;
            return;
        }

        // Đã đăng nhập -> kiểm tra quyền
        const permissionCheck = await checkUserPermission(user.uid);
        if (!permissionCheck.allowed) {
            // Không có quyền -> đăng xuất và chuyển về login
            const { signOut } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js');
            await signOut(auth);
            window.location.href = 'login.html';
        }
    }
});

async function checkUserPermission(uid) {
    try {
        const userDocRef = doc(db, 'users', uid);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
            return { allowed: false, message: 'Tài khoản chưa được cấp quyền truy cập.' };
        }

        const userData = userDocSnap.data();
        
        if (!userData.active) {
            return { allowed: false, message: 'Tài khoản này đã bị vô hiệu hóa.' };
        }

        return { allowed: true, role: userData.role || 'user' };
    } catch (error) {
        console.error('Lỗi kiểm tra quyền:', error);
        return { allowed: false, message: 'Không thể kiểm tra quyền truy cập.' };
    }
}
