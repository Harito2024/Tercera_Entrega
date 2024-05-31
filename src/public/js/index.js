const socket = io()


socket.on('products', (products)=>{
    const tbody = document.getElementById('products_body')
    tbody.innerHTML = ''
    console.log(products)
    products.products.forEach(product => {
        const row = tbody.insertRow()

        row.innerHTML=`
        
        <td>${product.title}</td>
        <td>${product.description}</td>
        <td>${product.price}</td>
        <td>${product.code}</td>
        <td>${product.stock}</td>
        <td>${product.category}</td>
        <td>${product.status}</td>
        <td>${product.thumbnails}</td>
        `
    });
})

/* const form = document.getElementById('product_form')

form.addEventListener('submit', function (e){
    e.preventDefault()

    const title = document.getElementById('title').value
    const description = document.getElementById('description').value
    const price = document.getElementById('price').value
    const code = document.getElementById('code').value
    const stock = document.getElementById('stock').value
    const category = document.getElementById('category').value
    const status = document.getElementById('status').value
    const thumbnail = document.getElementById('thumbnail').value

   
    const product ={
        title : title,
        description : description,
        price : price,
        code : code,
        stock : stock,
        category : category,
        status: status,
        thumbnail : thumbnail
    }
    
    socket.emit('addProduct', product)
    form.reset()
}) */
