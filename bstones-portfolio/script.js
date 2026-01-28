/**
 * BSTONES Portfolio - JavaScript
 * 스크롤 애니메이션, 헤더 효과, 인터랙션 처리
 * 
 * @author BSTONES Dev Team
 * @version 1.0.0
 */

(function() {
    'use strict';

    /**
     * DOM이 준비되면 실행
     */
    document.addEventListener('DOMContentLoaded', init);

    /**
     * 초기화 함수
     */
    function init() {
        loadPortfolioData();
        initScrollAnimations();
        initHeaderEffect();
        initSmoothScroll();
        initParallaxEffect();
        initAboutDotAnimation();
        initModal();

        console.log('✅ BSTONES Portfolio initialized successfully!');
    }

    // 캐시된 포트폴리오 데이터 (상세 포함)
    let portfolioCache = null;

    /**
     * 포트폴리오 데이터 로드
     */
    async function loadPortfolioData() {
        const portfolioGrid = document.querySelector('.portfolio__grid');
        if (!portfolioGrid) return;

        try {
            // 로딩 상태 표시
            portfolioGrid.innerHTML = '<p style="text-align: center; grid-column: 1 / -1; color: #666;">Loading portfolio...</p>';

            // 로컬 JSON 파일에서 데이터 로드
            const response = await fetch('data/portfolio.json');

            if (!response.ok) {
                throw new Error('Failed to fetch portfolio data');
            }

            const data = await response.json();
            portfolioCache = data;

            console.log('Portfolio Data loaded:', data.list.length, 'items');

            const items = data.list;

            if (items && items.length > 0) {
                renderPortfolioItems(items);
            } else {
                portfolioGrid.innerHTML = '<p style="text-align: center; grid-column: 1 / -1; color: #666;">No portfolio items found.</p>';
            }

            // 포트폴리오 호버 효과 재초기화
            initPortfolioHover();

        } catch (error) {
            console.error('Error loading portfolio:', error);
            portfolioGrid.innerHTML = '<p style="text-align: center; grid-column: 1 / -1; color: #f00;">Failed to load portfolio items.</p>';
        }
    }

    /**
     * 포트폴리오 아이템 렌더링
     */
    function renderPortfolioItems(items) {
        const portfolioGrid = document.querySelector('.portfolio__grid');
        if (!portfolioGrid) return;

        portfolioGrid.innerHTML = '';

        items.forEach((item, index) => {
            const portfolioItem = document.createElement('article');
            portfolioItem.className = 'portfolio__item';

            const card = createPortfolioCard(item);
            portfolioItem.appendChild(card);
            portfolioGrid.appendChild(portfolioItem);
        });
    }

    /**
     * 포트폴리오 카드 생성
     */
    function createPortfolioCard(item) {
        console.log('Creating card for item:', item);

        const card = document.createElement('a');
        card.href = '#';
        card.className = 'portfolio-card';
        card.dataset.idx = item.idx || '54'; // idx 저장 (없으면 54 사용)

        // 썸네일 이미지 - 다양한 필드명 지원
        const thumb = document.createElement('figure');
        thumb.className = 'portfolio-card__thumb';

        const img = document.createElement('img');
        const imgSrc = item.thumbnail || item.thumb || item.image || item.img || 'assets/portfolio_thumb_01.png';
        img.src = imgSrc;

        img.alt = item.title || item.name || 'Portfolio Item';
        img.loading = 'lazy';
        img.onerror = function() {
            this.src = 'assets/portfolio_thumb_01.png';
        };

        thumb.appendChild(img);

        // 카드 정보
        const info = document.createElement('div');
        info.className = 'portfolio-card__info';

        const desc = document.createElement('p');
        desc.className = 'portfolio-card__desc';
        desc.textContent = item.description || item.desc || item.content || item.summary || '';

        const date = document.createElement('time');
        date.className = 'portfolio-card__date';
        date.textContent = item.date || item.created_at || item.createdAt || item.year || '';
        if (item.datetime || item.date) {
            date.setAttribute('datetime', item.datetime || item.date);
        }

        const name = document.createElement('h3');
        name.className = 'portfolio-card__name';
        name.textContent = item.title || item.name || item.project || item.client || '';

        info.appendChild(desc);
        info.appendChild(date);
        info.appendChild(name);

        card.appendChild(thumb);
        card.appendChild(info);

        return card;
    }

    /**
     * 스크롤 애니메이션 (Intersection Observer)
     */
    function initScrollAnimations() {
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -100px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // 순차적 애니메이션을 위한 딜레이
                    setTimeout(() => {
                        entry.target.classList.add('animate-on-scroll');
                    }, index * 100);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // 애니메이션 대상 요소들
        const animateElements = document.querySelectorAll(
            '.about__item, .portfolio__item, .timeline__item, .history__content'
        );

        animateElements.forEach(el => {
            el.style.opacity = '0';
            observer.observe(el);
        });
    }

    /**
     * 헤더 스크롤 효과
     */
    function initHeaderEffect() {
        const header = document.querySelector('.header');
        if (!header) return;

        let lastScrollY = window.scrollY;
        let ticking = false;

        function updateHeader() {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100) {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.5)';
                header.style.boxShadow = '0 4px 4px rgba(0, 0, 0, 0.05)';
            }
            
            lastScrollY = currentScrollY;
            ticking = false;
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateHeader);
                ticking = true;
            }
        }, { passive: true });
    }

    /**
     * 부드러운 스크롤
     */
    function initSmoothScroll() {
        const scrollLinks = document.querySelectorAll('a[href^="#"]');
        
        scrollLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (!targetElement) return;
                
                e.preventDefault();
                
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            });
        });
    }

    /**
     * 포트폴리오 카드 호버 효과
     */
    function initPortfolioHover() {
        const portfolioCards = document.querySelectorAll('.portfolio-card');
        
        portfolioCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        });
    }

    /**
     * 패럴랙스 효과 (Hero 섹션)
     */
    function initParallaxEffect() {
        const hero = document.querySelector('.hero');
        const heroContent = document.querySelector('.hero__content');

        if (!hero || !heroContent) return;

        let ticking = false;

        function updateParallax() {
            const scrolled = window.scrollY;
            const heroHeight = hero.offsetHeight;

            // Hero 컨텐츠 패럴랙스
            if (scrolled < heroHeight) {
                heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
                heroContent.style.opacity = 1 - (scrolled / heroHeight) * 0.8;
            }

            // 버블 배경은 스태틱하게 유지 (패럴랙스 제거)

            ticking = false;
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }, { passive: true });
    }

    /**
     * About 섹션 도트 애니메이션
     */
    function initAboutDotAnimation() {
        const aboutItems = document.querySelectorAll('.about__item');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const dot = entry.target.querySelector('.about__dot');
                    if (dot) {
                        dot.style.transform = 'scale(1)';
                        dot.style.opacity = '1';
                    }
                }
            });
        }, {
            threshold: 0.5
        });

        aboutItems.forEach(item => {
            const dot = item.querySelector('.about__dot');
            if (dot) {
                dot.style.transform = 'scale(0)';
                dot.style.opacity = '0';
                dot.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
            }
            observer.observe(item);
        });
    }

    /**
     * 이미지 레이지 로딩 (네이티브 지원이 없는 경우)
     */
    function initLazyLoad() {
        if ('loading' in HTMLImageElement.prototype) {
            // 네이티브 레이지 로딩 지원
            return;
        }
        
        // 폴리필 필요시
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }

    /**
     * 타임라인 아이템 순차 애니메이션
     */
    function initTimelineAnimation() {
        const timelineItems = document.querySelectorAll('.timeline__item');
        
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                timelineItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, index * 100);
                });
                observer.disconnect();
            }
        }, {
            threshold: 0.2
        });

        timelineItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.transition = 'all 0.4s ease';
        });

        const timeline = document.querySelector('.timeline');
        if (timeline) {
            observer.observe(timeline);
        }
    }

    /**
     * 모달 초기화 및 이벤트 바인딩
     */
    function initModal() {
        const modal = document.getElementById('portfolioModal');
        const closeBtn = modal.querySelector('.modal__close');
        const overlay = modal.querySelector('.modal__overlay');

        // 닫기 버튼 클릭
        closeBtn.addEventListener('click', closeModal);

        // 오버레이 클릭
        overlay.addEventListener('click', closeModal);

        // ESC 키로 닫기
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('is-open')) {
                closeModal();
            }
        });

        // 포트폴리오 카드 클릭 이벤트는 동적으로 추가되므로
        // 이벤트 위임 사용
        document.addEventListener('click', (e) => {
            const card = e.target.closest('.portfolio-card');
            if (card) {
                e.preventDefault();
                const idx = card.dataset.idx || '54';
                openModal(idx);
            }
        });
    }

    /**
     * 모달 열기
     */
    async function openModal(idx) {
        const modal = document.getElementById('portfolioModal');
        const modalContent = modal.querySelector('.modal__content');

        // 모달 열기
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // 스크롤 방지

        // 로딩 상태 표시
        modalContent.innerHTML = '<div class="modal__loading">Loading...</div>';

        try {
            // 캐시된 데이터에서 상세 정보 로드
            let detail = null;
            if (portfolioCache && portfolioCache.details && portfolioCache.details[idx]) {
                detail = portfolioCache.details[idx];
            }

            if (!detail) {
                throw new Error('Portfolio detail not found');
            }

            console.log('Portfolio Detail:', detail);
            renderModalContent(detail);

        } catch (error) {
            console.error('Error loading portfolio detail:', error);
            modalContent.innerHTML = '<div class="modal__loading" style="color: #f00;">Failed to load portfolio details.</div>';
        }
    }

    /**
     * 모달 닫기
     */
    function closeModal() {
        const modal = document.getElementById('portfolioModal');
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = ''; // 스크롤 복원
    }

    /**
     * 모달 콘텐츠 렌더링
     */
    function renderModalContent(detail) {
        const modalContent = document.querySelector('.modal__content');

        const html = `
            <div class="modal__portfolio-label">PORTFOLIO.</div>
            <div class="modal__header">
                <div class="modal__title-row">
                    ${detail.brand ? `<span class="modal__brand">${detail.brand}</span>` : '<span class="modal__brand"></span>'}
                    ${detail.date ? `<time class="modal__date">${detail.date}</time>` : ''}
                </div>
                <h2 class="modal__title">${detail.title || ''}</h2>
                ${detail.subject ? `<p class="modal__subtitle">${detail.subject}</p>` : ''}
            </div>
            <div class="modal__images">
                ${detail.detail_image_1 ? `<img src="${detail.detail_image_1}" alt="${detail.title || 'Portfolio Image 1'}" class="modal__image">` : ''}
                ${detail.detail_image_2 ? `<img src="${detail.detail_image_2}" alt="${detail.title || 'Portfolio Image 2'}" class="modal__image">` : ''}
            </div>
        `;

        modalContent.innerHTML = html;
    }

    // 페이지 로드 완료 시 추가 초기화
    window.addEventListener('load', () => {
        initLazyLoad();
        initTimelineAnimation();
    });

})();
