import {ce} from './ext';

export default class TableFits_Create {

    /**
     * @param {HTMLDivElement} v
     * @returns {TableFits_Create}
     */
    static make(v) {
        return new TableFits_Create(v)
    }

    /**
     *
     * @param {HTMLDivElement} v
     */
    constructor(v) {
        /**
         * @type {HTMLDivElement}
         * @private
         */
        this._container = v;

        /**
         *
         * @type {Array}
         * @private
         */
        this._thead = [];

        /**
         *
         * @type {Array}
         * @private
         */
        this._mainTitleIndex = [];

        /**
         * @type {Array}
         * @private
         */
        this._rows = [];

        /**
         *
         * @type {Array}
         * @private
         */
        this._rowsClasses = [];

        this._mainClass = null;
    }

    /**
     * @param {String} v
     */
    setMainClass(v) {
        this._mainClass = v;
        return this;
    }

    /**
     * @param {TableFits_Prepare} prepare
     * @returns {TableFits_Create}
     */
    setPrepare(prepare) {
        this._thead = prepare.thead;
        this._mainTitleIndex = prepare.mainTitleIndex;
        this._rows = prepare.rows;
        this._rowsClasses = prepare.rowsClasses;

        return this;
    }

    create() {
        this._rows.forEach((row, rowIndex) => {

            let tr = ce('div',this._mainClass + '__tr');

            this._container.appendChild(tr);

            if (this._rowsClasses[rowIndex]) {
                this._rowsClasses[rowIndex].forEach((class_name) => {
                    tr.classList.add(class_name);
                });
            }

            if (this._mainTitleIndex.length) {
                tr.appendChild(this._createMainTitle(row));
            }

            /**
             * Тело
             * @type {HTMLDivElement}
             */
            let b = ce('div',this._mainClass + '__body');
            tr.appendChild(b);

            this._createRowData(b, row);

        });
    }

    /**
     * @param row
     * @returns {HTMLDivElement}
     * @private
     */
    _createMainTitle(row) {
        /**
         * Заголовок
         * @type {HTMLDivElement} h
         */
        let h = ce('div',this._mainClass + '__head');
        this._mainTitleIndex.forEach((i) => {
            let el = ce('div',this._mainClass + '__head__item');

            let isHasForm = false;
            row[i].childNodes.forEach((node) => {
                if (node instanceof HTMLInputElement) {
                    isHasForm = true;
                } else if (node instanceof HTMLSelectElement) {
                    isHasForm = true;
                }
            });

            if (isHasForm) {
                let th = ce('div',this._mainClass + '__th');
                th.appendChild(document.createTextNode(this._thead[i]));

                let td = ce('div',this._mainClass + '__td');

                row[i].childNodes.forEach((node) => {
                    td.appendChild(node);
                });
                row[i].newParent = td;


                el.appendChild(th);
                el.appendChild(td);
            } else {
                row[i].childNodes.forEach((node) => {
                    el.appendChild(node);
                });
                row[i].newParent = el;
            }

            h.appendChild(el);
        });

        return h;
    }

    /**
     * @param {HTMLDivElement} block_body
     * @param {Object} row
     * @private
     */
    _createRowData(block_body, row) {
        let i = 0;

        Object.keys(this._thead)
            .forEach((index) => {

                let thead_th = this._thead[index];

                let item = ce('div',this._mainClass + '__item');

                if (typeof thead_th !== 'string') {
                    // Столбцы
                    let columns__title = ce('div',this._mainClass + '__columns_title');

                    columns__title.appendChild(document.createTextNode(thead_th.title));

                    let columns = ce('div',this._mainClass + '__columns');

                    thead_th.columns.forEach((title) => {

                        if (this._mainTitleIndex.indexOf(i) !== -1) {
                            ++i;
                            return;
                        }

                        let c = ce('div',this._mainClass + '__columns__col');

                        let th = ce('div',this._mainClass + '__th');
                        th.appendChild(document.createTextNode(title));

                        let td = ce('div',this._mainClass + '__td');
                        row[i].childNodes.forEach((node) => {
                            td.appendChild(node);
                        });
                        row[i].newParent = td;

                        c.appendChild(th);
                        c.appendChild(td);
                        columns.appendChild(c);

                        ++i;
                    });

                    item.appendChild(columns__title);
                    item.appendChild(columns);
                } else {
                    // Просто
                    if (this._mainTitleIndex.indexOf(i) !== -1) {
                        ++i;
                        return;
                    }

                    let th = ce('div',this._mainClass + '__th');
                    th.appendChild(document.createTextNode(thead_th));

                    let td = ce('div',this._mainClass + '__td');

                    row[i].childNodes.forEach((nd) => {
                        td.appendChild(nd);
                    });
                    row[i].newParent = td;

                    item.appendChild(th);
                    item.appendChild(td);

                    ++i;
                }

                block_body.appendChild(item);
            });
    }
}