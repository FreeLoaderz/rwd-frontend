'use strict';

/*
 *   @constructorDisclosureButton
 *
 *
 */
class DisclosureButton {
    constructor(buttonNode, buttons) {
        this.buttonNode = buttonNode;
        this.allButtons = buttons;
        this.controlledNode = false;

        var id = this.buttonNode.getAttribute('aria-controls');
        this.controlledNode = document.getElementById(id);
        this.buttonNode.setAttribute('aria-expanded', 'false');
        this.hideContent();

        this.buttonNode.addEventListener('click', this.onClick.bind(this));
        this.buttonNode.addEventListener('focus', this.onFocus.bind(this));
        this.buttonNode.addEventListener('blur', this.onBlur.bind(this));
    }

    showContent() {
        if (this.controlledNode != null) {
            this.controlledNode.classList.remove("faq-hide");
            this.controlledNode.classList.remove("faq-show");
            this.controlledNode.classList.add("faq-show");
        }
    }

    hideContent() {
        if (this.controlledNode != null) {
            this.controlledNode.classList.remove("faq-hide");
            this.controlledNode.classList.remove("faq-show");
            this.controlledNode.classList.add("faq-hide");
        }
    }

    toggleExpand() {
        if (this.buttonNode.getAttribute('aria-expanded') === 'true') {
            this.buttonNode.setAttribute('aria-expanded', 'false');
            if (this.buttonNode.getElementsByClassName("fa-chevron-up")[0] != null) {
                this.buttonNode.getElementsByClassName("fa-chevron-up")[0].classList.add("fa-chevron-down");
                this.buttonNode.getElementsByClassName("fa-chevron-up")[0].classList.remove("fa-chevron-up");
                this.buttonNode.classList.remove('focus');
            }
            this.hideContent();
        } else {
            for (var i = 0; i < this.allButtons.length; i++) {
                if (this.allButtons[i] !== this.buttonNode) {
                    if (this.allButtons[i].getElementsByClassName("fa-chevron-up")[0] != null) {
                        this.allButtons[i].getElementsByClassName("fa-chevron-up")[0].classList.add("fa-chevron-down");
                        this.allButtons[i].getElementsByClassName("fa-chevron-up")[0].classList.remove("fa-chevron-up");
                    }
                    this.allButtons[i].setAttribute('aria-expanded', 'false');
                    var id = this.allButtons[i].getAttribute('aria-controls');
                    if (id != null) {
                        document.getElementById(id).classList.remove("faq-hide");
                        document.getElementById(id).classList.remove("faq-show");
                        document.getElementById(id).classList.add("faq-hide");
                    }
                }
            }
            this.buttonNode.setAttribute('aria-expanded', 'true');
            if (this.buttonNode.getElementsByClassName("fa-chevron-down")[0] != null) {
                this.buttonNode.getElementsByClassName("fa-chevron-down")[0].classList.add("fa-chevron-up");
                this.buttonNode.getElementsByClassName("fa-chevron-down")[0].classList.remove("fa-chevron-down");
            }
            this.showContent();
        }
    }

    /* EVENT HANDLERS */

    onClick() {
        this.toggleExpand();
    }

    onFocus() {
        this.buttonNode.classList.add('focus');
    }

    onBlur() {
        this.buttonNode.classList.remove('focus');
    }
}

/* Initialize Hide/Show Buttons */

window.addEventListener(
    'load',
    function () {
        var buttons = document.querySelectorAll(
            'button[aria-expanded][aria-controls]'
        );

        for (var i = 0; i < buttons.length; i++) {
            new DisclosureButton(buttons[i], buttons);
        }
    },
    false
);