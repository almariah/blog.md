const yaml = require('js-yaml');

export const fetchPosts = async (tags, current, limit) => {
    const response = await fetch('/posts.yaml');
    const yamlData = await response.text();
    const posts = yaml.load(yamlData);
    posts.sort(function (a, b) {
        const keyA = new Date(a.date), keyB = new Date(b.date);
        if (keyA < keyB)
            return 1;
        if (keyA > keyB)
            return -1;
        return 0;
    });
    let filtered = posts.filter(function (item) {
        for (const tag of tags) {
            if (!item.tags.includes(tag)) {
                return false;
            }
        }
        if (current !== undefined) {
            if (item.link.replace(/\.md$/, "") === current) {
                return false;
            }
        }
        return true;
    });
    if (limit === 0 || limit === undefined) {
        return filtered
    }
    return filtered.slice(0,limit);
}

export const fetchPostsByDate = async (tags, locale) => {
    if (locale === undefined) {
        locale = "default"
    }
    return fetchPosts(tags, null, 0).then(function(posts) {
        return posts.reduce(function (r, a_1) {
            const date = new Date(a_1.date);
            const year = date.toLocaleString(locale, { year:"numeric"});
            r[year] = r[year] || [];
            a_1.date = date.toLocaleString(locale, { month: 'short',  day:"numeric"});
            r[year].push(a_1);
            return r;
        }, Object.create(null));
    })
}

export const fetchTags = async (tags, exclude) => {
    return fetchPosts(tags, null, 0).then(function(posts) {
        let tagSet = new Set()
        posts.forEach(post => {
            post.tags.forEach(tag => {
                if (!exclude.includes(tag)) {
                    tagSet.add(tag)
                }
            })
        })
        return Array.from(tagSet);
    })
}
