const WATCH_BUTTON_CLASS_NAME = 'shikimori-ext__button';
const BUTTONS_BLOCK_SELECTOR = '.b-db_entry > .c-image > .b-user_rate';
const REFERENCE_BUTTON_SELECTOR = `${BUTTONS_BLOCK_SELECTOR} .b-add_to_list .trigger`
const PLAY_ICON = '<svg xmlns="http://www.w3.org/2000/svg" width="27" height="11" viewBox="0 0 25 25" fill="currentColor"><path d="M2 24v-24l20 12-20 12z"/></svg>';

const createWatchButtonInnerHtml = (label) => {
    const buttonInnerContent = document.createElement('div');
    buttonInnerContent.style.display = 'inline-flex';

    const buttonInnerIcon = document.createElement('span');
    buttonInnerIcon.innerHTML = PLAY_ICON;

    const buttonInnerLabel = document.createElement('span');
    buttonInnerLabel.innerText = label;

    buttonInnerContent.append(buttonInnerIcon);
    buttonInnerContent.append(buttonInnerLabel);

    return buttonInnerContent;
}

const createWatchButtonNode = (watchUrl) => {
    const button = document.createElement('a');
    button.className += WATCH_BUTTON_CLASS_NAME;
    button.href = watchUrl;
    button.target = "_blank";
    
    const watchButtonInnerNode = createWatchButtonInnerHtml('Смотреть');
    button.appendChild(watchButtonInnerNode);

    const copyStyleFromNode = document.querySelector(REFERENCE_BUTTON_SELECTOR);

    const stylesNode = window.getComputedStyle(copyStyleFromNode);

    button.style.border = stylesNode.border;
    button.style.boxShadow = stylesNode.boxShadow;
    button.style.borderRadius = stylesNode.borderRadius;
    button.style.background = stylesNode.background;
    button.style.color = stylesNode.color;
    button.style.fontSize = stylesNode.fontSize;
    button.style.fontWeight = stylesNode.fontWeight;
    button.style.lineHeight = stylesNode.lineHeight;
    button.style.maxWidth = stylesNode.maxWidth;
    button.style.padding = stylesNode.padding;
    button.style.boxSizing = stylesNode.boxSizing;
    button.style.display = stylesNode.display;
    button.style.color = stylesNode.color;
    button.style.textAlign = 'left';
    button.style.marginBottom = '3px';

    return button;
}

const addWatchButton = (addToNode, watchUrl) => {
    const watchButtonNode = createWatchButtonNode(watchUrl)

    addToNode.prepend(watchButtonNode);
}

const findButtonsBlock = () => document.querySelector(BUTTONS_BLOCK_SELECTOR);

const createWatchAnimeUrl = (animeId) => {
    if (animeId === undefined || animeId === null) {
        throw new Error('animeId cannot be undefined / null');
    }

    const watchMetaNode = document.querySelector('meta[name="shikimori-ext-url"]');
    const watchUrl = watchMetaNode?.content;
    if (!watchUrl) {
        return;
    }

    return `${watchUrl}?id=${animeId}`;
}

const showWatchButton = () => {
    const buttonsBlock = findButtonsBlock();
    if (!buttonsBlock) {
        throw new Error("Couldn't find reference button :(");
    }

    const animeDataAttribute = buttonsBlock.getAttribute('data-entry');
    const animeData = JSON.parse(animeDataAttribute);
    if (!animeData) {
        return;
    }

    const animeUrl = createWatchAnimeUrl(animeData?.id);

    addWatchButton(buttonsBlock, animeUrl)
}

const isWatchButtonShown = () => (
    !!document.querySelector(`${BUTTONS_BLOCK_SELECTOR} > .${WATCH_BUTTON_CLASS_NAME}`)
)

const toggleWatchButton = () => {
    if (!isWatchButtonShown()) {
        showWatchButton();
    }
}

const observer = new MutationObserver(toggleWatchButton);

const onPageLoad = () => {
    const buttonsBlock = findButtonsBlock();
    if (!buttonsBlock) {
        return;
    }

    toggleWatchButton();

    observer.observe(buttonsBlock, {
        childList: true,
    });
}

window.addEventListener('turbolinks:load', onPageLoad);
window.addEventListener('load', onPageLoad);