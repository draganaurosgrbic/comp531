const LOREM_IPSUM = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."

const getRandomInterval = () => {
    return Math.floor(Math.random() * 5) + 1;
}

const posts = [
    {
        text: LOREM_IPSUM,
        images: [
            'https://img.freepik.com/free-photo/purple-osteospermum-daisy-flower_1373-16.jpg?w=2000',
            'https://images.unsplash.com/photo-1530092285049-1c42085fd395?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d2hpdGUlMjBmbG93ZXJ8ZW58MHx8MHx8fDA%3D&w=1000&q=80',
            'https://hips.hearstapps.com/hmg-prod/images/close-up-of-tulips-blooming-in-field-royalty-free-image-1584131603.jpg'
        ],
        currentImageIndex: 0,
        intervalLength: getRandomInterval(),
        intervalId: -1
    },
    {
        text: LOREM_IPSUM,
        images: [
            'https://images.unsplash.com/photo-1562690868-60bbe7293e94?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cm9zZSUyMGZsb3dlcnxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80',
            'https://cdn.pixabay.com/photo/2012/03/01/00/55/flowers-19830_640.jpg',
            'https://hips.hearstapps.com/hmg-prod/images/close-up-of-blossoming-rose-flower-royalty-free-image-1580853844.jpg'
        ],
        currentImageIndex: 0,
        intervalLength: getRandomInterval(),
        intervalId: -1
    },
    {
        text: LOREM_IPSUM,
        /*images: [
            'https://img.freepik.com/premium-photo/pink-rose-with-green-leave-some-part-red-rose-nataral-blured-background-ai-generated_70626-14731.jpg?w=2000',
            'https://cdn.pixabay.com/photo/2013/07/21/13/00/rose-165819_640.jpg'
        ],*/
        currentImageIndex: 0,
        intervalLength: getRandomInterval(),
        intervalId: -1
    },
    {
        text: LOREM_IPSUM,
        images: [
            'https://images.pexels.com/photos/850359/pexels-photo-850359.jpeg?cs=srgb&dl=pexels-jess-bailey-designs-850359.jpg&fm=jpg',
            'https://static.vecteezy.com/system/resources/previews/001/270/991/non_2x/hand-drawing-flower-vector.jpg',
            'https://images.pexels.com/photos/56866/garden-rose-red-pink-56866.jpeg?cs=srgb&dl=pexels-pixabay-56866.jpg&fm=jpg'
        ],
        currentImageIndex: 0,
        intervalLength: getRandomInterval(),
        intervalId: -1
    },
    {
        text: LOREM_IPSUM,
        images: [
            'https://png.pngtree.com/png-clipart/20201208/original/pngtree-rustic-flower-graphic-png-image_5537591.jpg',
            'https://images.unsplash.com/photo-1604085572504-a392ddf0d86a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8b3JhbmdlJTIwZmxvd2VyfGVufDB8fDB8fHww&w=1000&q=80',
            'https://img.freepik.com/free-photo/natures-beauty-captured-colorful-flower-close-up-generative-ai_188544-8593.jpg?w=2000'
        ],
        currentImageIndex: 0,
        intervalLength: getRandomInterval(),
        intervalId: -1
    },
    {
        // text: LOREM_IPSUM,
        images: [
            'https://contentgrid.homedepot-static.com/hdus/en_US/DTCCOMNEW/Articles/discover-the-secret-language-of-flowers-2022-hero.jpeg',
            'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Morning-glory-C6295b.jpg/640px-Morning-glory-C6295b.jpg',
            'https://cdn.britannica.com/84/73184-050-05ED59CB/Sunflower-field-Fargo-North-Dakota.jpg'
        ],
        currentImageIndex: 0,
        intervalLength: getRandomInterval(),
        intervalId: -1
    },
    {
        text: LOREM_IPSUM,
        images: [
            'https://cdn.pixabay.com/photo/2015/04/19/08/32/marguerite-729510_640.jpg',
            'https://wdy.h-cdn.co/assets/18/02/1280x1920/gallery-1515696895-red-roses.jpg',
            'https://www.1800flowers.com/blog/wp-content/uploads/2021/05/Birthday-Flowers-Colors.jpg.webp'
        ],
        currentImageIndex: 0,
        intervalLength: getRandomInterval(),
        intervalId: -1
    },
    {
        text: LOREM_IPSUM,
        images: [
            'https://thumbs.dreamstime.com/b/frangipani-flowers-10997030.jpg',
            'https://hips.hearstapps.com/hmg-prod/images/types-of-garden-flowers-purple-allium-1674847068.jpeg',
            'https://i0.wp.com/artisthue.com/wp-content/uploads/2019/10/Screenshot-2020-06-18-at-23.43.31.png?fit=1192%2C1178&ssl=1'
        ],
        currentImageIndex: 0,
        intervalLength: getRandomInterval(),
        intervalId: -1
    }
]

const setPostInterval = (post, postImage) => {
    post.intervalLength = getRandomInterval();
    post.intervalId = setInterval(() => {
        post.currentImageIndex = (post.currentImageIndex + 1) % post.images.length;
        postImage.src = post.images[post.currentImageIndex];
    }, post.intervalLength * 1000);
}

const loadPosts = () => {
    const postsTable = document.getElementById('postsTable');
    let tableRow;

    for (let i = 0; i < posts.length; ++i) {
        const post = posts[i];

        if (i % 2 === 0) {
            tableRow = document.createElement('tr');
            postsTable.append(tableRow);
        }

        const postCell = document.createElement('td');
        tableRow.append(postCell);

        const postDiv = document.createElement('div');
        postCell.append(postDiv);

        if (post.images && post.images.length) {
            const postImageDiv = document.createElement('div');
            postDiv.append(postImageDiv);

            const postImage = document.createElement('img');
            postImage.src = post.images[post.currentImageIndex];
            postImageDiv.append(postImage);

            const postButtonDiv = document.createElement('div');
            postCell.append(postButtonDiv);

            const postButton = document.createElement('button');
            postButton.innerHTML = 'Stop';
            postButtonDiv.append(document.createElement('div'));
            postButtonDiv.append(postButton);

            setPostInterval(post, postImage);
            postButton.addEventListener('click', () => {
                if (postButton.innerHTML === 'Start') {
                    postButton.innerHTML = 'Stop';
                    setPostInterval(post, postImage);
                } else {
                    postButton.innerHTML = 'Start';
                    clearInterval(post.intervalId);
                }
            })
        }

        if (post.text) {
            const postText = document.createElement('div');
            postText.innerHTML = post.text;
            postDiv.append(postText);
        }
    }
}

