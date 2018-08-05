class CPFDate extends CPField {

    constructor(container, props) {
        super(container, props);
        this.type = 'date';
    }

    content() {
        return `
            <div class="${this.prefix}-control-group" ${this.idAttribute}="${this.id}">
                ${ this.label() }
                <input 
                    type="date"
                    name="${this.props.name}"
                    autoComplete="off"
                    class="${this.prefix}-form-control"
                    ${ this.placeholder() 
                        ? "placeholder=\"" + this.placeholder() + "\"" 
                        : "DD/MM/YYYY"
                    }
                />
            </div>
        `;
    }
}