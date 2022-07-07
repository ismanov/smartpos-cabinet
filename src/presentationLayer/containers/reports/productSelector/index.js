import React, {useState, useEffect} from 'react';
import Select from "react-select";
import Logic from "../../../../businessLayer";
import axios from 'axios';
const CancelToken = axios.CancelToken;
var source = CancelToken.source();

const ProductSelector = props => {

    const [selectedProduct, setSelectedProduct] = useState();
    const [productList, setProductList] = useState([]);    
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (props.productId && !selectedProduct) {
            setSelectedProduct(props.productId)
            LogicContainer
                .product
                .fetchProductById(props.productId, props.branchId)
                .then(response => {
                    source.cancel('Остановить запрос!');
                    source = CancelToken.source();
                    Logic
                        .product
                        .fetchProductListForKeyword({search: response.data.name, branchId: props.branchId}, source.token)
                        .then(response => {
                            setProductList(response.data)
                        })
                        .catch(console.log)                    
                })
        }        
    }, [props.productId])

    useEffect(() => {
        setProductList([]);
        setSelectedProduct(undefined);        
    }, [props.branchId])
    
    
    useEffect(() => {
        props.onChange && props.onChange(selectedProduct)
    }, [selectedProduct])

    return (
        <Select
            placeholder='Поиск'
            onChange={id => {
                let found = productList.find(item => item.id === id.value);
                if (found) {
                    setSelectedProduct(id);
                }
                if (!id) {
                    setSelectedProduct(undefined)                    
                }
            }}
            value={selectedProduct || ''}
            onInputChange={input => {
                if (input.length >= 2) {
                    source.cancel('Остановить запрос!');
                    source = CancelToken.source();
                    setIsLoading(true)
                    Logic
                        .product
                        .fetchProductListForKeyword({search: input, branchId: props.branchId}, source.token)
                        .then(response => {
                            setIsLoading(false)
                            setProductList(response.data)
                        })
                        .catch(console.log)                    
                } else {
                    setProductList([]);                    
                }
            }}

            options={productList.map(item => ({label: `${item.name}; баркод: ${item.barcode}`, value: item.id}))}
            isClearable={true}
            isMulti={false}
            isSearchable={true}
            isLoading={isLoading}
            noOptionsMessage={() => 'Ничего не найдено!'}
            loadingMessage={() => 'Идет поиск'}
            styles={{
                control: (styles, { data, isDisabled, isFocused, isSelected, is }) => ({
                    ...styles,
                    width: '100%',
                    height: 54,
                    boxShadow: isFocused || isSelected ? '0 0 1px #009f3c' : 'none',
                    borderColor: isFocused || isSelected ? '#009f3c' : '#666',
                    ':hover': {
                        borderColor: isFocused || isSelected ? '#009f3c' : '#666'
                    }
                })
            }}
        />
    );
}

export default ProductSelector;
