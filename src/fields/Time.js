class CPFTime extends CPField {

    constructor(container, props) {
        super(container, props);
        this.type = 'time';
    }

    content() {
        return `
            <div class="${this.prefix}-control-group" ${this.idAttribute}="${this.id}">
                ${ this.label() }
                <input 
                    type="time"
                    name="${this.props.name}"
                    autoComplete="off"
                    class="${this.prefix}-form-control"
                    ${ this.placeholder()
                        ? "placeholder=\"" + this.placeholder() + "\""
                        : ""
                    }
                />
            </div>
        `;
    }
}