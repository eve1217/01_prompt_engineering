(function () {
    'use strict';

    // === STATE ===
    let currentUser = null;
    let portfolioItems = [];
    let currentFilter = 'all';
    let currentSearch = '';
    let editingItemId = null;

    // Type labels
    const TYPE_LABELS = {
        '1': 'Promotion',
        '2': 'Operation',
        '3': 'Development',
        '4': 'Banner/SNS'
    };

    // === INITIALIZATION ===
    document.addEventListener('DOMContentLoaded', init);

    function init() {
        initAuth();
        initNavigation();
        initFilterTabs();
        initSearch();
        initFormEvents();
        initUploadZones();
    }

    // === AUTH MODULE ===
    function initAuth() {
        auth.onAuthStateChanged(function (user) {
            if (user) {
                currentUser = user;
                document.getElementById('login-overlay').style.display = 'none';
                document.getElementById('admin-app').style.display = 'flex';
                loadDashboard();
            } else {
                currentUser = null;
                document.getElementById('login-overlay').style.display = 'flex';
                document.getElementById('admin-app').style.display = 'none';
            }
        });

        document.getElementById('login-form').addEventListener('submit', function (e) {
            e.preventDefault();
            var email = document.getElementById('login-email').value;
            var password = document.getElementById('login-password').value;
            var errorEl = document.getElementById('login-error');
            errorEl.textContent = '';

            auth.signInWithEmailAndPassword(email, password).catch(function (error) {
                errorEl.textContent = error.message;
            });
        });

        document.getElementById('btn-logout').addEventListener('click', function () {
            auth.signOut();
        });
    }

    // === NAVIGATION MODULE ===
    function initNavigation() {
        var navLinks = document.querySelectorAll('.sidebar__link[data-view]');
        navLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                var view = this.dataset.view;
                showView(view);
                navLinks.forEach(function (l) { l.classList.remove('sidebar__link--active'); });
                this.classList.add('sidebar__link--active');
            });
        });

        document.getElementById('btn-add-new').addEventListener('click', function () {
            editingItemId = null;
            resetForm();
            document.getElementById('form-title').textContent = 'Add Portfolio';
            showView('form');
        });

        document.getElementById('btn-back-to-list').addEventListener('click', function () {
            showView('list');
            // Re-activate the list nav button
            var navLinks = document.querySelectorAll('.sidebar__link[data-view]');
            navLinks.forEach(function (l) { l.classList.remove('sidebar__link--active'); });
            document.querySelector('.sidebar__link[data-view="list"]').classList.add('sidebar__link--active');
        });

        document.getElementById('btn-cancel').addEventListener('click', function () {
            showView('list');
            var navLinks = document.querySelectorAll('.sidebar__link[data-view]');
            navLinks.forEach(function (l) { l.classList.remove('sidebar__link--active'); });
            document.querySelector('.sidebar__link[data-view="list"]').classList.add('sidebar__link--active');
        });
    }

    function showView(viewName) {
        document.querySelectorAll('.view').forEach(function (v) { v.style.display = 'none'; });
        document.getElementById('view-' + viewName).style.display = 'block';

        if (viewName === 'dashboard') loadDashboard();
        if (viewName === 'list') loadPortfolioList();
        if (viewName === 'form' && !editingItemId) resetForm();
    }

    // === FILTER & SEARCH ===
    function initFilterTabs() {
        document.querySelectorAll('.filter-tab').forEach(function (tab) {
            tab.addEventListener('click', function () {
                document.querySelectorAll('.filter-tab').forEach(function (t) { t.classList.remove('filter-tab--active'); });
                this.classList.add('filter-tab--active');
                currentFilter = this.dataset.type;
                renderFilteredList();
            });
        });
    }

    function initSearch() {
        document.getElementById('search-input').addEventListener('input', function () {
            currentSearch = this.value.toLowerCase();
            renderFilteredList();
        });
    }

    function renderFilteredList() {
        var filtered = portfolioItems.filter(function (item) {
            var matchType = currentFilter === 'all' || item.type === currentFilter;
            var matchSearch = !currentSearch ||
                (item.title && item.title.toLowerCase().includes(currentSearch)) ||
                (item.brand && item.brand.toLowerCase().includes(currentSearch));
            return matchType && matchSearch;
        });
        renderPortfolioListItems(filtered);
    }

    // === DASHBOARD MODULE ===
    function loadDashboard() {
        db.collection('portfolios').get().then(function (snapshot) {
            var items = snapshot.docs.map(function (doc) { return Object.assign({ id: doc.id }, doc.data()); });
            renderStats(items);
            renderRecentItems(items);
        }).catch(function (error) {
            console.error('Error loading dashboard:', error);
        });
    }

    function renderStats(items) {
        var stats = {
            total: items.length,
            type1: items.filter(function (i) { return i.type === '1'; }).length,
            type2: items.filter(function (i) { return i.type === '2'; }).length,
            type3: items.filter(function (i) { return i.type === '3'; }).length,
            type4: items.filter(function (i) { return i.type === '4'; }).length
        };

        document.getElementById('stats-grid').innerHTML =
            '<div class="stat-card">' +
                '<div class="stat-card__number">' + stats.total + '</div>' +
                '<div class="stat-card__label">Total Projects</div>' +
            '</div>' +
            '<div class="stat-card stat-card--type1">' +
                '<div class="stat-card__number">' + stats.type1 + '</div>' +
                '<div class="stat-card__label">Promotion</div>' +
            '</div>' +
            '<div class="stat-card stat-card--type2">' +
                '<div class="stat-card__number">' + stats.type2 + '</div>' +
                '<div class="stat-card__label">Operation</div>' +
            '</div>' +
            '<div class="stat-card stat-card--type3">' +
                '<div class="stat-card__number">' + stats.type3 + '</div>' +
                '<div class="stat-card__label">Development</div>' +
            '</div>' +
            '<div class="stat-card stat-card--type4">' +
                '<div class="stat-card__number">' + stats.type4 + '</div>' +
                '<div class="stat-card__label">Banner/SNS</div>' +
            '</div>';
    }

    function renderRecentItems(items) {
        var sorted = items.slice().sort(function (a, b) {
            var aTime = a.createdAt && a.createdAt.toMillis ? a.createdAt.toMillis() : 0;
            var bTime = b.createdAt && b.createdAt.toMillis ? b.createdAt.toMillis() : 0;
            return bTime - aTime;
        });

        var recent = sorted.slice(0, 5);
        var html = '';

        if (recent.length === 0) {
            html = '<div class="empty-state"><p>No portfolio items yet.</p></div>';
        } else {
            recent.forEach(function (item) {
                html += '<div class="recent-item">' +
                    '<img class="recent-item__thumb" src="' + (item.thumbnail || 'assets/portfolio_thumb_01.png') + '" alt="" onerror="this.src=\'assets/portfolio_thumb_01.png\'">' +
                    '<div class="recent-item__info">' +
                        '<div class="recent-item__title">' + escapeHtml(item.title || '') + '</div>' +
                        '<div class="recent-item__meta">' + escapeHtml(item.brand || '') + ' &middot; ' + escapeHtml(item.date || '') + '</div>' +
                    '</div>' +
                    '<span class="recent-item__badge badge--type' + item.type + '">' + (TYPE_LABELS[item.type] || '') + '</span>' +
                '</div>';
            });
        }

        document.getElementById('recent-list').innerHTML = html;
    }

    // === PORTFOLIO LIST MODULE ===
    function loadPortfolioList() {
        var listEl = document.getElementById('portfolio-list');
        listEl.innerHTML = '<div class="loading-spinner">Loading...</div>';

        db.collection('portfolios').orderBy('order', 'asc').get().then(function (snapshot) {
            portfolioItems = snapshot.docs.map(function (doc) { return Object.assign({ id: doc.id }, doc.data()); });
            renderFilteredList();
        }).catch(function (error) {
            console.error('Error loading list:', error);
            listEl.innerHTML = '<div class="empty-state"><p>Failed to load items.</p></div>';
        });
    }

    function renderPortfolioListItems(items) {
        var listEl = document.getElementById('portfolio-list');

        if (items.length === 0) {
            listEl.innerHTML = '<div class="empty-state"><p>No items found.</p></div>';
            return;
        }

        var html = '';
        items.forEach(function (item) {
            html += '<div class="admin-card" draggable="true" data-id="' + item.idx + '">' +
                '<div class="admin-card__drag-handle">&#9776;</div>' +
                '<img class="admin-card__thumb" src="' + (item.thumbnail || 'assets/portfolio_thumb_01.png') + '" alt="" onerror="this.src=\'assets/portfolio_thumb_01.png\'">' +
                '<div class="admin-card__info">' +
                    '<div class="admin-card__title">' + escapeHtml(item.title || '') + '</div>' +
                    '<div class="admin-card__meta">' + escapeHtml(item.brand || '') + ' &middot; ' + escapeHtml(item.date || '') +
                    ' <span class="recent-item__badge badge--type' + item.type + '">' + (TYPE_LABELS[item.type] || '') + '</span></div>' +
                '</div>' +
                '<div class="admin-card__actions">' +
                    '<button class="btn btn--outline btn--small btn-edit" data-id="' + item.idx + '">Edit</button>' +
                    '<button class="btn btn--danger btn--small btn-delete" data-id="' + item.idx + '">Delete</button>' +
                '</div>' +
            '</div>';
        });

        listEl.innerHTML = html;
        initDragAndDrop();
        initListActions();
    }

    function initListActions() {
        document.querySelectorAll('.btn-edit').forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                loadEditForm(this.dataset.id);
            });
        });

        document.querySelectorAll('.btn-delete').forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                deleteItem(this.dataset.id);
            });
        });
    }

    // === DRAG & DROP MODULE ===
    function initDragAndDrop() {
        var list = document.getElementById('portfolio-list');
        var dragItem = null;

        list.addEventListener('dragstart', function (e) {
            var card = e.target.closest('.admin-card');
            if (!card) return;
            dragItem = card;
            card.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
        });

        list.addEventListener('dragend', function (e) {
            var card = e.target.closest('.admin-card');
            if (card) card.classList.remove('dragging');
            dragItem = null;
            // Remove any placeholders
            var ph = list.querySelector('.drag-placeholder');
            if (ph) ph.remove();
        });

        list.addEventListener('dragover', function (e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            if (!dragItem) return;

            var afterElement = getDragAfterElement(list, e.clientY);
            if (afterElement) {
                list.insertBefore(dragItem, afterElement);
            } else {
                list.appendChild(dragItem);
            }
        });

        list.addEventListener('drop', function (e) {
            e.preventDefault();
            if (!dragItem) return;
            dragItem.classList.remove('dragging');
            saveNewOrder();
            dragItem = null;
        });
    }

    function getDragAfterElement(container, y) {
        var elements = Array.from(container.querySelectorAll('.admin-card:not(.dragging)'));
        var closest = null;
        var closestOffset = Number.NEGATIVE_INFINITY;

        elements.forEach(function (child) {
            var box = child.getBoundingClientRect();
            var offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closestOffset) {
                closestOffset = offset;
                closest = child;
            }
        });

        return closest;
    }

    function saveNewOrder() {
        var cards = document.querySelectorAll('.admin-card');
        var batch = db.batch();

        cards.forEach(function (card, index) {
            var docRef = db.collection('portfolios').doc(card.dataset.id);
            batch.update(docRef, {
                order: index,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        });

        batch.commit().then(function () {
            showNotification('Order saved.', 'success');
        }).catch(function (error) {
            console.error('Error saving order:', error);
            showNotification('Failed to save order.', 'error');
        });
    }

    // === CRUD MODULE ===
    function initFormEvents() {
        document.getElementById('portfolio-form').addEventListener('submit', function (e) {
            e.preventDefault();
            saveItem();
        });

        // Live preview updates
        ['form-title-input', 'form-brand', 'form-date', 'form-type', 'form-subject'].forEach(function (id) {
            document.getElementById(id).addEventListener('input', updatePreview);
        });
    }

    function loadEditForm(idx) {
        editingItemId = idx;
        document.getElementById('form-title').textContent = 'Edit Portfolio';

        db.collection('portfolios').doc(idx).get().then(function (doc) {
            if (!doc.exists) {
                showNotification('Item not found.', 'error');
                return;
            }
            var data = doc.data();

            document.getElementById('form-idx').value = data.idx || idx;
            document.getElementById('form-title-input').value = data.title || '';
            document.getElementById('form-brand').value = data.brand || '';
            document.getElementById('form-date').value = data.date || '';
            document.getElementById('form-type').value = data.type || '';
            document.getElementById('form-subject').value = data.subject || '';

            // Show existing images
            if (data.thumbnail) {
                showImagePreview('preview-thumbnail', data.thumbnail);
            }
            if (data.detail_image_1) {
                showImagePreview('preview-detail1', data.detail_image_1);
            }
            if (data.detail_image_2) {
                showImagePreview('preview-detail2', data.detail_image_2);
            }

            updatePreview();
            showView('form');
        }).catch(function (error) {
            console.error('Error loading item:', error);
            showNotification('Failed to load item.', 'error');
        });
    }

    function saveItem() {
        var idx = document.getElementById('form-idx').value;
        var title = document.getElementById('form-title-input').value.trim();
        var brand = document.getElementById('form-brand').value.trim();
        var date = document.getElementById('form-date').value.trim();
        var type = document.getElementById('form-type').value;
        var subject = document.getElementById('form-subject').value.trim();

        if (!title || !brand || !date || !type) {
            showNotification('Please fill in all required fields.', 'error');
            return;
        }

        // Generate idx if new
        if (!idx) {
            idx = String(Date.now());
        }

        var btnSave = document.getElementById('btn-save');
        btnSave.disabled = true;
        btnSave.textContent = 'Saving...';

        // Convert images to base64 Data URLs
        var thumbnailFile = document.getElementById('file-thumbnail').files[0];
        var detail1File = document.getElementById('file-detail1').files[0];
        var detail2File = document.getElementById('file-detail2').files[0];

        var imageReads = [];

        if (thumbnailFile) {
            imageReads.push(readFileAsDataURL(thumbnailFile).then(function (dataUrl) {
                return { field: 'thumbnail', url: dataUrl };
            }));
        }
        if (detail1File) {
            imageReads.push(readFileAsDataURL(detail1File).then(function (dataUrl) {
                return { field: 'detail_image_1', url: dataUrl };
            }));
        }
        if (detail2File) {
            imageReads.push(readFileAsDataURL(detail2File).then(function (dataUrl) {
                return { field: 'detail_image_2', url: dataUrl };
            }));
        }

        Promise.all(imageReads).then(function (results) {
            var docData = {
                idx: idx,
                title: title,
                brand: brand,
                date: date,
                type: type,
                subject: subject,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };

            // Add image Data URLs
            results.forEach(function (r) {
                docData[r.field] = r.url;
            });

            if (editingItemId) {
                // Update existing
                return db.collection('portfolios').doc(editingItemId).update(docData);
            } else {
                // Create new - get next order
                return db.collection('portfolios').orderBy('order', 'desc').limit(1).get().then(function (snapshot) {
                    var maxOrder = snapshot.empty ? -1 : snapshot.docs[0].data().order || 0;
                    docData.order = maxOrder + 1;
                    docData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
                    return db.collection('portfolios').doc(idx).set(docData);
                });
            }
        }).then(function () {
            showNotification(editingItemId ? 'Updated successfully.' : 'Created successfully.', 'success');
            editingItemId = null;
            showView('list');
            // Re-activate list nav
            var navLinks = document.querySelectorAll('.sidebar__link[data-view]');
            navLinks.forEach(function (l) { l.classList.remove('sidebar__link--active'); });
            document.querySelector('.sidebar__link[data-view="list"]').classList.add('sidebar__link--active');
        }).catch(function (error) {
            console.error('Error saving:', error);
            showNotification('Failed to save: ' + error.message, 'error');
        }).finally(function () {
            btnSave.disabled = false;
            btnSave.textContent = 'Save';
        });
    }

    function deleteItem(idx) {
        if (!confirm('Are you sure you want to delete this item?')) return;

        db.collection('portfolios').doc(idx).delete().then(function () {
            showNotification('Deleted successfully.', 'success');
            loadPortfolioList();
        }).catch(function (error) {
            console.error('Error deleting:', error);
            showNotification('Failed to delete.', 'error');
        });
    }

    // === IMAGE MODULE (base64 Data URL) ===
    function readFileAsDataURL(file) {
        return new Promise(function (resolve, reject) {
            var reader = new FileReader();
            reader.onload = function (e) { resolve(e.target.result); };
            reader.onerror = function () { reject(new Error('Failed to read file')); };
            reader.readAsDataURL(file);
        });
    }

    function initUploadZones() {
        setupUploadZone('upload-thumbnail', 'file-thumbnail', 'preview-thumbnail');
        setupUploadZone('upload-detail1', 'file-detail1', 'preview-detail1');
        setupUploadZone('upload-detail2', 'file-detail2', 'preview-detail2');
    }

    function setupUploadZone(zoneId, inputId, previewId) {
        var zone = document.getElementById(zoneId);
        var input = document.getElementById(inputId);
        var preview = document.getElementById(previewId);

        zone.addEventListener('click', function () {
            input.click();
        });

        zone.addEventListener('dragover', function (e) {
            e.preventDefault();
            zone.classList.add('dragover');
        });

        zone.addEventListener('dragleave', function () {
            zone.classList.remove('dragover');
        });

        zone.addEventListener('drop', function (e) {
            e.preventDefault();
            zone.classList.remove('dragover');
            if (e.dataTransfer.files.length) {
                input.files = e.dataTransfer.files;
                handleFileSelect(input, preview);
            }
        });

        input.addEventListener('change', function () {
            handleFileSelect(input, preview);
        });
    }

    function handleFileSelect(input, preview) {
        if (!input.files || !input.files[0]) return;

        var reader = new FileReader();
        reader.onload = function (e) {
            showImagePreview(preview.id, e.target.result);
            updatePreview();
        };
        reader.readAsDataURL(input.files[0]);
    }

    function showImagePreview(previewId, src) {
        var preview = document.getElementById(previewId);
        preview.src = src;
        preview.style.display = 'block';
        // Hide placeholder
        var zone = preview.closest('.upload-zone');
        var placeholder = zone.querySelector('.upload-zone__placeholder');
        if (placeholder) placeholder.style.display = 'none';
    }

    // === PREVIEW MODULE ===
    function updatePreview() {
        var title = document.getElementById('form-title-input').value || 'Project Title';
        var brand = document.getElementById('form-brand').value || 'Brand';
        var date = document.getElementById('form-date').value || 'Date';
        var subject = document.getElementById('form-subject').value || '';
        var thumbnailPreview = document.getElementById('preview-thumbnail');
        var thumbSrc = thumbnailPreview.style.display !== 'none' && thumbnailPreview.src ? thumbnailPreview.src : 'assets/portfolio_thumb_01.png';

        // Card preview
        document.getElementById('card-preview').innerHTML =
            '<div class="portfolio-card">' +
                '<figure class="portfolio-card__thumb">' +
                    '<img src="' + thumbSrc + '" alt="' + escapeHtml(title) + '">' +
                '</figure>' +
                '<div class="portfolio-card__info">' +
                    '<p class="portfolio-card__desc">' + escapeHtml(subject).substring(0, 60) + '</p>' +
                    '<time class="portfolio-card__date">' + escapeHtml(date) + '</time>' +
                    '<h3 class="portfolio-card__name">' + escapeHtml(title) + '</h3>' +
                '</div>' +
            '</div>';

        // Modal preview
        var detail1 = document.getElementById('preview-detail1');
        var detail2 = document.getElementById('preview-detail2');
        var detail1Src = detail1.style.display !== 'none' && detail1.src ? detail1.src : '';
        var detail2Src = detail2.style.display !== 'none' && detail2.src ? detail2.src : '';

        document.getElementById('modal-preview').innerHTML =
            '<div>' +
                '<span class="modal-preview__brand">' + escapeHtml(brand) + '</span>' +
                '<span class="modal-preview__date">' + escapeHtml(date) + '</span>' +
            '</div>' +
            '<h3 class="modal-preview__title">' + escapeHtml(title) + '</h3>' +
            (subject ? '<p class="modal-preview__subject">' + escapeHtml(subject) + '</p>' : '') +
            '<div class="modal-preview__images">' +
                (detail1Src ? '<img src="' + detail1Src + '" alt="Detail 1">' : '') +
                (detail2Src ? '<img src="' + detail2Src + '" alt="Detail 2">' : '') +
            '</div>';
    }

    function resetForm() {
        editingItemId = null;
        document.getElementById('portfolio-form').reset();
        document.getElementById('form-idx').value = '';

        // Hide image previews
        ['preview-thumbnail', 'preview-detail1', 'preview-detail2'].forEach(function (id) {
            var preview = document.getElementById(id);
            preview.src = '';
            preview.style.display = 'none';
            var zone = preview.closest('.upload-zone');
            var placeholder = zone.querySelector('.upload-zone__placeholder');
            if (placeholder) placeholder.style.display = '';
        });

        updatePreview();
    }

    // === NOTIFICATION ===
    function showNotification(message, type) {
        var el = document.getElementById('notification');
        el.textContent = message;
        el.className = 'notification notification--' + (type || 'info') + ' show';

        setTimeout(function () {
            el.classList.remove('show');
        }, 3000);
    }

    // === UTILITY ===
    function escapeHtml(str) {
        var div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }

})();
