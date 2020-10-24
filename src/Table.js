import React from 'react';
import './Table.css';
import numeral from "numeral";

function Table({ countries }) {
    return (
        <div className="table">
            {/* destructing the each country data from countries into each country and cases (it's cases) at once */}
            {countries.map(({country, cases}) => (
                <tr>
                    <td>{country}</td>
                    <td>
                    <strong>{numeral(cases).format("0,0")}</strong>
                    </td>
                </tr>
            ))}
        </div>
    );
}

export default Table
