import Logic from '#businessLayer';
import {defineGranularity, formatForGranularity} from "../../../../../utils/format";
import {    
    REPORT_BY_ONE_PRODUCT_DYNAMICS,
    REPORT_BY_ONE_PRODUCT_LIST,
    REPORT_BY_ONE_PRODUCT_STATS,
    REPORT_BY_ONE_PRODUCT_SORT,
} from '../reducer';
import moment from "moment";
import FileDownload from "js-file-download";

export const setSort = (sort) => ({
    type: REPORT_BY_ONE_PRODUCT_SORT,
    payload: sort,
});

export const reportByOneProduct = ({branchId, from, to, page, size, productId, withGranularity, sort}) => {
    return dispatch => {
        let granularity = 'DAY';
        if (withGranularity) {
            granularity = defineGranularity({ from: new Date(from), to: new Date(to) })
        }
        Logic
            .report
            .reportByOneProduct({
                branchId, 
                from, 
                to, 
                page, 
                size, 
                productId, 
                granularity, 
                orderBy: sort ? sort.col : undefined, 
                sortOrder: sort ? sort.order : undefined,
            })
            .then(response => {
                if (!withGranularity) {
                    dispatch({
                        type: REPORT_BY_ONE_PRODUCT_LIST,
                        payload: response.data
                    })
                } else {
                    let { content } = response.data;
                    console.log("content", content, granularity)
                    let f = moment(from);
                    f.set({ hour: 0, minute: 0, second: 0, millisecond: 0});
                    let t = moment(to);
                    let result = [];

                    while (f.isBefore(t)) {
                        let n = f.clone();
                        n.add(1, granularity);
                        
                        if (n.isAfter(t)) {
                            n = t.clone()
                        }
                        let day = f.format(formatForGranularity(granularity));

                        let receiptCount = 0;
                        let salesCount = 0;
                        let salesTotal = 0;
                        let discount = 0;

                        

                        content.forEach(item => {
                            let dateTime = moment(item.dateTime);
                            console.log("n: ", n.format(), "dateTime: ", dateTime.format())
                            if (dateTime.valueOf() >= f.valueOf() && dateTime.valueOf() < n.valueOf()) {
                                salesCount += (item.salesCount || 0);
                                salesTotal += (item.salesTotal || 0);
                                receiptCount += (item.receiptCount || 0);
                                discount += (item.discount || 0);
                            }
                        });
                        result.push({ unit: day, amounts: { receiptCount, salesCount, salesTotal, discount }});
                        f.add(1, granularity)
                    }
                    dispatch({
                        type: REPORT_BY_ONE_PRODUCT_DYNAMICS,
                        payload: result
                    })
                }
            })
            .catch(console.log)
    }
};

export const reportByOneProductSalesStats = ({branchId, from, to, page, size, productId}) => {
    return dispatch => {
        Logic
            .report
            .reportByProducts({ branchId, page, size, from, to, productId })
            .then(response => {
                dispatch({
                    type: REPORT_BY_ONE_PRODUCT_STATS,
                    payload: response.data.content && response.data.content.length !== 0 ? response.data.content[0] : undefined
                })
            })
            .catch(console.log)
    }
};

export const byOneProductsExcelReport = (filter) => {
    return () => {
        Logic
            .excel
            .byOneProduct(filter)
            .then(response => { FileDownload(response.data, 'report_by_one_product.xlsx'); })
            .catch(error => {})
    }
};

