import DataFactory from '../node_modules/n3/src/N3DataFactory.js';
import N3Store from '../node_modules/n3/src/N3Store.js'; // stream in N3Store.js

export function generateQuickGuid() {
    return Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
}

export function get_uri(uri_scheme, s) {
    return "<" + uri_scheme + ":" + s + ">";
}

function to_n3_UBL(v) {
    let n3_v = null;
    if (v.UBLType === 'N') {
	n3_v = null;
    } else if (v.UBLType === 'U') {
	n3_v = DataFactory.namedNode(v.resource);
    } else if (v.UBLType === 'B') {
	n3_v = DataFactory.blankNode(v.resource);
    } else if (v.UBLType === 'L') {
	n3_v = DataFactory.literal(v.resource);
    }
    return n3_v;
}

export function to_n3_rows(rq_select_result) {
    //debugger;
    let ret = [];
    let cols = Object.keys(rq_select_result);
    let rq_select_result_length = rq_select_result[cols[0]].length;
    for (let i = 0; i < rq_select_result_length; i++) {
	let row = {};
	cols.forEach((col) => {
	    let v = rq_select_result[col][i];
	    let n3_v = to_n3_UBL(v);
	    row = {...row, [col]: n3_v};
	});
	ret.push(row);
    }
    return ret;
}

export function to_n3_model(rq_construct_result) {
    let ret = new N3Store();
    rq_construct_result.forEach((triple) => {
	let s = to_n3_UBL(triple[0]);
	let p = to_n3_UBL(triple[1]);
	let o = to_n3_UBL(triple[2]);
	ret.addQuad(s, p, o);
    });
    return ret;
}

    
