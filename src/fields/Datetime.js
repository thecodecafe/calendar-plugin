class CPFDatetime extends CPField {

    constructor(container, props) {
        super(container, props);
        this.type = 'datetime';
    }

    content() {
        return `
            <div class="${this.prefix}-control-group" ${this.idAttribute}="${this.id}">
                ${ this.label() }
                <input 
                    type="text"
                    name="${this.props.name}"
                    autoComplete="off"
                    class="${this.prefix}-form-control"
                    placeholder="${this.placeholder() || ''}"
                />
            </div>
        `;
    }
}