
// array of default images
imagesArray = [
    'assets/images/font-image.png',
    'assets/images/design-thinking.png',
    'assets/images/dashboard.png',
    'assets/images/letter-a.png',
    'assets/images/web-programming.png',
    'assets/images/pantone.png'
];

//fetch all blogs and dispaly them in home page
fetchBlogs();

// fetch all blogs to display them in the home page
function fetchBlogs() {
    // GET request by default
    fetch('http://localhost:3000/blogs')
        .then(response => response.json())
        .then(data => {
            const blogsSection = document.getElementById("blogs-section");
            blogsSection.innerHTML = ''; // remove existing content

            //sort blogs starting from latest ones 
            sortBlogsByDate(data);

            // html structure for eaxh blog
            data.forEach(blog => {
                let imagePath = imagesArray[0];

                // convert the id from string to number to use it as index for imagesArray
                let intId = parseInt(blog.id);
                console.log(intId);

                // change image path if the id can be conveted to a number
                if (!isNaN(intId)) {
                    imagePath = imagesArray[intId % 6];
                }


                blogsSection.innerHTML += `<div class="blog-item">
                   <div class="img-container">
                     <a href="#"><img class="blog-img" src="${imagePath}" alt="" /></a>
                   </div>
                   <div class="container">
                     <h2 class="blog-title"><a href="#">${blog.title}</a></h2>
                     <p class="blog-date">${blog.date}</p>
                     <p class="blog-description">${blog.description}</p>
                     <button type="button" class="delete-btn" onclick="deleteBlog('${blog.id}')">Delete</button>
                     <button type="button" class="update-btn" onclick="updateBlog('${blog.id}')">Update</button>
                   </div>
                 </div>`;
            });
        })
        .catch(error => console.error('Error:', error));
}

// fetch blog by id
async function fetchBlogById(blogId) {
    try {
        const response = await fetch(`http://localhost:3000/blogs/${blogId}`);
        const blog = await response.json();
        console.log(blog);
        return blog;
    } catch (error) {
        console.error('Error:', error);
        return { title: 'not availabe', description: 'not availabe' };
    }
}


// function fetchBlogById(blogId) {
//     let blog;
//     fetch(`http://localhost:3000/blogs/${blogId}`)
//         .then(response => response.json() )
//         .then(data =>{
//             console.log(data); //actual data
//             blog = data;
//             console.log(blog); //actual data
//             return data;
//         })
//         .catch(error => console.error('Error:', error));;
//         console.log(blog);//undefined
//         return blog;
// }



// delete a blog using its key
function deleteBlog(blogId) {
    console.log(blogId);
    // show sweetalert confirmation dialog
    Swal.fire({
        title: "Are you sure you want to delete this blog?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {

            fetch(`http://localhost:3000/blogs/${blogId}`, {
                method: 'DELETE'
            })
                .then(response => {
                    if (response.ok) {
                        Swal.fire({
                            title: "Deleted!",
                            text: "The blog has been deleted.",
                            icon: "success",
                            confirmButtonText: "Ok",
                        });
                        fetchBlogs();

                    } else {
                        console.error('An error occurred while deleting the blog. Please try again.');
                    }
                })
                .catch(error => console.error('Error:', error));
        }
    });
}

//update a blog
async function updateBlog(blogId) {
    const blog = await fetchBlogById(blogId);

    const { value: formValues } = await Swal.fire({
        title: "Enter a new title and description.",
        html: `
          <textarea id="swal-input1" class="swal2-textarea" >${blog.title}</textarea>
          <textarea id="swal-input2" class="swal2-textarea" >${blog.description}</textarea>
        `,
        focusConfirm: false,
        preConfirm: () => {
            return [
                document.getElementById("swal-input1").value,
                document.getElementById("swal-input2").value
            ];
        },
        showCancelButton: true
    });
    // if (formValues[0].length > 0 && formValues[1].length > 0) {
    //     innerUpdateFunction(formValues[0], formValues[1]);
    // } else {
    //     Swal.fire("You must enter a title and a description!");
    // }

    let titleValidation = validateBlogTitle(formValues[0]);
    let descriptionValidation = validBlogDescription(formValues[1]);
    if (titleValidation == true && descriptionValidation == true) {
        innerUpdateFunction(formValues[0], formValues[1]);
    } else {
        Swal.fire({
            title: "Inavlid input",
            // used html instead of text to add a <br/>
            html: `${titleValidation != true ? titleValidation : ''}<br/>${descriptionValidation != true ? descriptionValidation : ''}`,
            icon: "error",
        });

        return 0;
    }

    function innerUpdateFunction(title, description) {
        const updatedBlog = {
            title: title,
            description: description
        };

        fetch(`http://localhost:3000/blogs/${blogId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedBlog)
        })
            .then(response => {
                if (response.ok) {
                    Swal.fire({
                        title: "Updated!",
                        text: "The blog has been updated.",
                        icon: "success",
                        confirmButtonText: "Ok",
                        confirmButtonColor: "#3085d6",

                    });

                   fetchBlogs();
                } else {
                    console.error('An error occurred while deleting the blog. Please try again.');

                }
            })
            .catch(error => console.error('Error:', error));

    }
}


function addBlog(title, description) {

    const titleValidation = validateBlogTitle(title);
    const descriptionValidation = validBlogDescription(description);


    if (titleValidation != true || descriptionValidation != true) {
        Swal.fire({
            title: "Inavlid input",
            // used html instead of text to add a <br/>
            html: `${titleValidation != true ? titleValidation : ''}<br/>${descriptionValidation != true ? descriptionValidation : ''}`,
            icon: "error",
        });

        return 0;
    }

    const currentDate = getCurrentDate();

    const newBlog = {
        title: title,
        description: description,
        date: currentDate
    };

    fetch('http://localhost:3000/blogs', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newBlog)
    })
        .then(response => {
            if (response.ok) {
                return response.json(); // Return the newly created blog
            } else {
                console.error('An error occurred while adding the blog. Please try again.');
                throw new Error('Failed to add blog');
            }
        })
        .then(addedBlog => {
            Swal.fire({
                title: "Added!",
                text: "The blog has been added.",
                icon: "success",
            });
            fetchBlogs();
        })
        .catch(error => console.error('Error:', error));
}

// receives the title of a blog, and returns:
// true: if the title valid
// error message: if the title is not valid
function validateBlogTitle(title) {

    // ensure that text includes ascii characters only
    let languageRegex = /^[\x00-\x7F]+$/;
    // let languageRegex = /^[A-Za-z]*\d*$/;

    if (title.length == 0) {
        return "You should enter a title for the blog.";
    } else if (title.length > 100) {
        return "The title can have 50 characters at most.";
    } else if (!languageRegex.test(title)) {
        return "The title can contain English characters and numbers only. Do not start the title with a number.";
    }

    return true;
}

// receives the description of a blog, and returns:
// true: if the description valid
// error message: if the description is not valid
function validBlogDescription(description) {
    // ensure that text includes ascii characters only
    let languageRegex = /^[\x00-\x7F]+$/;

    if (description.length == 0) {
        return "You should enter a description for the blog.";
    } else if (description.length > 1000) {
        return "The description can have 1000 characters at most.";
    } else if (!languageRegex.test(description)) {
        return "The description can have English characters only.";
    }
 
    return true;
}

//sorts the blogs starting from latest ones
function sortBlogsByDate(blogs) {

    blogs.sort((a, b) => {
        let da = new Date(a.date);
        let db = new Date(b.date);
        return db - da;
    });

    return blogs;
}

function getCurrentDate() {
    const date = new Date();

    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);

    return formattedDate;
}

var hideDropdownMenu = true; 
function showDropdownMenu(){
    hideDropdownMenu = !hideDropdownMenu;
    if (hideDropdownMenu){
        document.getElementById("dropdown-content").style.display = "none";
    }else{
        document.getElementById("dropdown-content").style.display = "block";
    }
}



//see https://chatgpt.com/share/2c05c01d-cd1a-442a-9b0f-13050e5976dc for async explaination

