class QueryBuilder {
    constructor() {
        this._type = '';
        this._table = '';
        this._fields = null;
        this._where = '';
        this._order = '';
        this._limit = '';
        this._group = '';
    }


    setType(value) {
        this._type = value;
    }

    setTable(value) {
        this._table = value;
    }

    setFields(value) {
        this._fields = value;
    }

    setWhere(value) {
        this._where = value;
    }

    setOrder(value) {
        this._order = value;
    }

    setLimit(value) {
        this._limit = value;
    }

    setGroup(value) {
        this._group = value;
    }

    getSql() {
        let string = '';
        switch (this._type.toLowerCase()) {
            case 'select':
                string = `SELECT `;
                if (this._fields && this._fields.length > 0) {
                    string += this._fields.join(', ');
                } else {
                    string += '*';
                }
                string += ` FROM ${this._table}`;
                if (this._where !== '') {
                    string += ` WHERE ${this._where}`;
                }
                if (this._order !== '') {
                    string += ` ORDER BY ${this._order}`;
                }
                if (this._limit !== '') {
                    string += ` LIMIT ${this._limit}`;
                }
                if (this._group !== '') {
                    string += ` GROUP BY ${this._group}`;
                }
                break;
            case 'createtable':
                string = `CREATE TABLE IF NOT EXISTS ${this._table} (`;
                if (Object.keys(this._fields).length > 0) {
                    string += Object.keys(this._fields).map(key => `${key} ${this._fields[key]}`).join(', ');
                }
                string += ')';
                break;
            case 'insert':
                string = `INSERT INTO ${this._table} (`;
                if (Object.keys(this._fields).length > 0) {
                    string += Object.keys(this._fields).join(', ');
                }
                string += ') VALUES (';
                if (Object.keys(this._fields).length > 0) {
                    string += Object.keys(this._fields).map(key => '?').join(', ');
                }
                string += ')';
                break;
        }
        console.log(string);
        return string;
    }
}

export default QueryBuilder;