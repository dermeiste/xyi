import React from 'react'
import {Helmet} from 'react-helmet'

const Meta = ({description,title,keywords}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={description}/>
      <meta name='keyword' content={keywords}/>
    </Helmet>
  )
}
Meta.defaultProps = {
  description:'We sell the best products for cheap',
  title:'Welcome to ProShop',
  keywords:'electronics, buy electronics, cheap electroincs'
}

export default Meta
