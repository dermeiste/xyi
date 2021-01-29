import React,{useEffect} from 'react'
import {useSelector,useDispatch} from 'react-redux'
import {listProducts} from '../actions/productActions'
import {Row,Col,Button,Table} from 'react-bootstrap'
import Message from '../components/Message'
import Loader from '../components/Loader'
import {Link} from 'react-router-dom'
import {listProductDelete,createProduct} from '../actions/productActions'
import Paginate from '../components/Paginate'
import {PRODUCT_LIST_DELETE_RESET,PRODUCT_CREATE_RESET} from '../constants/productConstants'

const ProductListScreen = ({history,match}) => {
  const pageNumber = match.params.pageNumber || 1
  const dispatch = useDispatch()
  const {loading,error,products,page,pages} = useSelector(state => state.productList)
  const {userInfo} = useSelector(state => state.userLogin)
  const {loading:loadingCreate,error:errorCreate,success:successCreate,product:createdProduct} = useSelector(state => state.productCreate)
  const {loading:loadingDelete,error:errorDelete,success:successDelete} = useSelector(state => state.productListDelete)

  useEffect(() => {
    dispatch({type:PRODUCT_CREATE_RESET})
    if(userInfo && !userInfo.isAdmin) {
      history.push('/login')
    }


    if(successCreate) {
      history.push(`/admin/product/${createdProduct._id}/edit`)
    }else {
        dispatch(listProducts('',pageNumber))
    }

  },[dispatch,successDelete,userInfo,successCreate,match])

  const deleteHandler = (id) => {
    console.log('deletehandler')
    dispatch(listProductDelete(id))
    //dispatch({type:PRODUCT_LIST_DELETE_RESET})
  }
  const createHandler = () => {
    dispatch(createProduct())
  }
  return (
    <>

      <Row className="align-items-center">
        <Col>Products</Col>
        <Col className="text-right"><Button className="my-3" onClick={createHandler}>Create Product</Button></Col>
      </Row>
      {errorCreate && <Message className="danger">{error}</Message>}
      {loadingCreate && <Loader />}
      {error && <Message className="danger">{error}</Message>}
      {loading && <Loader />}
      <Table striped responsive hover bordered className="sm-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>NAME</th>
            <th>PRICE</th>
            <th>CATEGORY</th>
            <th>BRAND</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {
            products && products.map(product => (
              <tr key={product._id}>
                <td>{product._id}</td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>{product.brand}</td>
                <td>
                  <Link to={`/admin/product/${product._id}/edit`}><i className="fas fa-edit"></i></Link> | <Button className="btn-sm"><i className="fas fa-trash" onClick={() => deleteHandler(product._id)}></i></Button>
                </td>
              </tr>
            ))

          }
        </tbody>
      </Table>
      <Paginate page={page} pages={pages} isAdmin={true}/>
    </>
  )
}
export default ProductListScreen
