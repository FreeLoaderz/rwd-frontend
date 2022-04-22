export class DisclosureButton {
    public id: string;
    public desc: any;

    constructor(public buttonNode: any) {
        this.buttonNode = buttonNode;
        this.id = this.buttonNode.getAttribute('aria-controls');
        this.desc = document.getElementById(this.id);
        this.buttonNode.setAttribute('aria-expanded', 'false');
        this.hideContent();
        this.buttonNode.addEventListener('focus', this.onFocus.bind(this));
        this.buttonNode.addEventListener('blur', this.onBlur.bind(this));
    }

    showContent() {
        this.buttonNode.setAttribute('aria-expanded', 'true');
        if (this.buttonNode.getElementsByClassName("fa-chevron-down")[0] != null) {
            this.buttonNode.getElementsByClassName("fa-chevron-down")[0].classList.add("fa-chevron-up");
            this.buttonNode.getElementsByClassName("fa-chevron-down")[0].classList.remove("fa-chevron-down");
        }
        this.desc.classList.remove("faq-hide");
        this.desc.classList.remove("faq-show");
        this.desc.classList.add("faq-show");
    }

    hideContent() {
        this.buttonNode.setAttribute('aria-expanded', 'false');
        if (this.buttonNode.getElementsByClassName("fa-chevron-up")[0] != null) {
            this.buttonNode.getElementsByClassName("fa-chevron-up")[0].classList.add("fa-chevron-down");
            this.buttonNode.getElementsByClassName("fa-chevron-up")[0].classList.remove("fa-chevron-up");
            this.buttonNode.classList.remove('focus');
        }
        this.desc.classList.remove("faq-hide");
        this.desc.classList.remove("faq-show");
        this.desc.classList.add("faq-hide");
    }

    toggleExpand() {
        if (this.buttonNode.getAttribute('aria-expanded') === 'true') {
            this.hideContent();
        } else {
            this.showContent();
        }
    }

    onFocus() {
        this.buttonNode.classList.add('focus');
    }

    onBlur() {
        this.buttonNode.classList.remove('focus');
    }
}