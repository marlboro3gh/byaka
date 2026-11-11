"use strict";

/*
 * Романтический сайт-подарок.
 *
 * Состояния:
 * welcome -> success -> love -> compliments -> final
 *
 * В проекте нет сторонних библиотек.
 */

(() => {
    const compliments = [
        "Ты - самое прекрасное, что случилось со мной",
        "Я невероятно счастлив, что мы познакомились",
        "Я обожаю когда ты мне пишешь",
        "Ты просто невероятна ",
        "Ты мое чудо",
        "Мне безумно нравится твой характер и то, какая ты настоящая",
        "Ты - тот человек, которому я могу доверять",
        "Я счастлив, что мы встретились снова",
        "Ты делаешь мою жизнь намного ярче просто тем, что ты в ней есть",
        "Мне невероятно повезло встретить именно тебя",
        "Ты заслуживаешь всего самого прекрасного в этом мире",
        "Каждый момент рядом с тобой хочется сохранить навсегда",
        "Ты прекрасна не только внешне - твоя душа еще прекраснее",
        "Я очень расстраиваюсь, когда тебе грустно",
        "Если бы мне снова пришлось выбирать, я бы выбрал именно тебя"
    ];

    const screens = {
        welcome: document.getElementById("welcomeScreen"),
        success: document.getElementById("successScreen"),
        love: document.getElementById("loveScreen"),
        compliments: document.getElementById("complimentsScreen"),
        final: document.getElementById("finalScreen")
    };

    const nameForm = document.getElementById("nameForm");
    const nameInput = document.getElementById("nameInput");
    const nameError = document.getElementById("nameError");
    const successName = document.getElementById("successName");

    const yesButton = document.getElementById("yesButton");
    const noButton = document.getElementById("noButton");

    const startComplimentsButton = document.getElementById(
        "startComplimentsButton"
    );

    const nextComplimentButton = document.getElementById(
        "nextComplimentButton"
    );

    const nextButtonText = document.getElementById("nextButtonText");
    const progressText = document.getElementById("progressText");

    const complimentNumber = document.getElementById("complimentNumber");
    const complimentTitle = document.getElementById("complimentTitle");

    const transitionGlow = document.getElementById("transitionGlow");

    let currentScreen = "welcome";
    let currentCompliment = 0;
    let isTransitioning = false;

    const SCREEN_TRANSITION_MS = 620;
    const COMPLIMENT_TRANSITION_MS = 300;

    function normalizeName(value) {
        return value
            .trim()
            .replace(/\s+/g, " ")
            .slice(0, 40);
    }

    function showError(message) {
        nameError.textContent = message;
        nameError.classList.add("is-visible");
        nameInput.setAttribute("aria-invalid", "true");
    }

    function clearError() {
        nameError.textContent = "";
        nameError.classList.remove("is-visible");
        nameInput.removeAttribute("aria-invalid");
    }

    function triggerTransitionGlow() {
        transitionGlow.classList.remove("is-active");

        void transitionGlow.offsetWidth;

        transitionGlow.classList.add("is-active");
    }

    function setScreenAccessibility(screenName) {
        Object.entries(screens).forEach(([name, screen]) => {
            const isCurrent = name === screenName;

            screen.setAttribute(
                "aria-hidden",
                isCurrent ? "false" : "true"
            );
        });
    }

    function switchScreen(nextScreen) {
        if (!screens[nextScreen] || currentScreen === nextScreen) {
            return;
        }

        if (isTransitioning) {
            return;
        }

        isTransitioning = true;

        triggerTransitionGlow();

        const previousScreen = screens[currentScreen];
        const targetScreen = screens[nextScreen];

        previousScreen.classList.remove("is-active");

        window.setTimeout(() => {
            targetScreen.classList.add("is-active");
            currentScreen = nextScreen;
            setScreenAccessibility(nextScreen);

            window.setTimeout(() => {
                isTransitioning = false;
            }, 80);
        }, 180);
    }

    function setCompliment(index, animate = true) {
        if (
            !Number.isInteger(index) ||
            index < 0 ||
            index >= compliments.length
        ) {
            return;
        }

        currentCompliment = index;

        const text = compliments[index];
        const number = String(index + 1).padStart(2, "0");

        if (!animate) {
            complimentTitle.textContent = text;
            complimentNumber.textContent = number;
            progressText.textContent = `${index + 1} / ${compliments.length}`;

            nextButtonText.textContent =
                index === compliments.length - 1 ? "Завершить" : "Далее";

            return;
        }

        complimentTitle.classList.remove(
            "is-changing",
            "is-entering"
        );

        void complimentTitle.offsetWidth;

        complimentTitle.classList.add("is-changing");

        window.setTimeout(() => {
            complimentTitle.textContent = text;
            complimentNumber.textContent = number;
            progressText.textContent = `${index + 1} / ${compliments.length}`;

            nextButtonText.textContent =
                index === compliments.length - 1 ? "Завершить" : "Далее";

            complimentTitle.classList.remove("is-changing");

            void complimentTitle.offsetWidth;

            complimentTitle.classList.add("is-entering");
        }, COMPLIMENT_TRANSITION_MS);
    }

    function submitName() {
        if (isTransitioning) {
            return;
        }

        const name = normalizeName(nameInput.value);

        if (!name) {
            showError("Сначала напиши свое имя");
            nameInput.focus();
            return;
        }

        clearError();

        successName.textContent = name;

        nameInput.blur();

        switchScreen("success");
    }

    function handleYes() {
        if (isTransitioning) {
            return;
        }

        switchScreen("love");
    }

    function handleStartCompliments() {
        if (isTransitioning) {
            return;
        }

        currentCompliment = 0;
        setCompliment(0, false);

        switchScreen("compliments");
    }

    function handleNextCompliment() {
        if (isTransitioning) {
            return;
        }

        if (currentCompliment >= compliments.length - 1) {
            switchScreen("final");
            return;
        }

        isTransitioning = true;
        setCompliment(currentCompliment + 1, true);

    
        window.setTimeout(() => {
            isTransitioning = false;
        }, COMPLIMENT_TRANSITION_MS + 80);
    }


    function initializeNoButton() {
        noButton.setAttribute("aria-disabled", "true");
        noButton.setAttribute("tabindex", "-1");
        noButton.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
        });
    }

    nameForm.addEventListener("submit", (event) => {
        event.preventDefault();
        submitName();
    });

    nameInput.addEventListener("input", () => {
        if (nameError.classList.contains("is-visible")) {
            clearError();
        }
    });

    nameInput.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            nameInput.value = "";
            clearError();
        }
    });

    yesButton.addEventListener("click", handleYes);

    startComplimentsButton.addEventListener(
        "click",
        handleStartCompliments
    );

    nextComplimentButton.addEventListener(
        "click",
        handleNextCompliment
    );

    initializeNoButton();

    setCompliment(0, false);
    setScreenAccessibility("welcome");

    /*
     * Автоматически возвращаем фокус к полю имени
     * после полной загрузки страницы.
     */
    window.setTimeout(() => {
        if (currentScreen === "welcome") {
            nameInput.focus();
        }
    }, 450);
})();