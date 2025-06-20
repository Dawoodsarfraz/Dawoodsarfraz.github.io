// research.js

let CURRENT_BLOG_FILENAME = '';

function loadBlog(markdownPath, identifier) {
  CURRENT_BLOG_FILENAME = identifier;
  fetch(markdownPath)
    .then(res => {
      if (!res.ok) throw new Error("Markdown file not found.");
      return res.text();
    })
    .then(md => {
      const html = marked.parse(md);
      document.getElementById("blogContent").innerHTML = html;

      const videos = document.querySelectorAll("#blogContent video");
      videos.forEach(v => {
        v.setAttribute("controls", "true");
        v.setAttribute("muted", "true");
        v.setAttribute("loop", "true");
      });

      document.getElementById("blogModal").style.display = "flex";
      if (window.DISQUS) {
        DISQUS.reset({
          reload: true,
          config: function () {
            this.page.identifier = identifier;
            this.page.url = window.location.href + '#' + identifier;
          }
        });
      }
    })
    .catch(err => {
      document.getElementById("blogContent").innerHTML = "<p style='color: red;'>Unable to load blog content. File not found.</p>";
      document.getElementById("blogModal").style.display = "flex";
    });
}

function closeBlog() {
  document.getElementById("blogModal").style.display = "none";
}

document.getElementById("blogSearch").addEventListener("input", function (e) {
  const query = e.target.value.toLowerCase();
  document.querySelectorAll(".blog-post").forEach(post => {
    const text = post.innerText.toLowerCase();
    post.style.display = text.includes(query) ? "flex" : "none";
  });
});

// Disqus config
var disqus_config = function () {
  this.page.url = window.location.href;
  this.page.identifier = CURRENT_BLOG_FILENAME;
};
(function () {
  var d = document, s = d.createElement('script');
  s.src = 'https://YOUR-DISQUS-SHORTNAME.disqus.com/embed.js';
  s.setAttribute('data-timestamp', +new Date());
  (d.head || d.body).appendChild(s);
})();
