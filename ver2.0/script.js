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
        initScrollAnimations();
        initHeaderEffect();
        initSmoothScroll();
        initPortfolioHover();
        initParallaxEffect();
        initAboutDotAnimation();
        
        console.log('✅ BSTONES Portfolio initialized successfully!');
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
        const bubbles = document.querySelectorAll('.portfolio__bubble');
        
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
            
            // 버블 배경 패럴랙스
            bubbles.forEach((bubble, index) => {
                const speed = 0.03 + (index * 0.02);
                bubble.style.transform = `translateY(${scrolled * speed}px)`;
            });
            
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

    // 페이지 로드 완료 시 추가 초기화
    window.addEventListener('load', () => {
        initLazyLoad();
        initTimelineAnimation();
    });

})();
