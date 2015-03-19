= Adding Images

To add images to your blog posts:

. Commit images to this directory.
. In your blog post, use the following basic AsciiDoc syntax:
+
[source,AsciiDoc]
----
image::<filename>[]
----
. See http://asciidoctor.org/docs/asciidoc-writers-guide/ for complex examples of Image syntax.

If you are embedding images from a hosted source -- such as instagram, another GitHub repository, or any photo hosting sites -- put the full URL to the image in place of the `<filename>`.

.Hosted Image Embed
----
image::http://<full path to image>[]
----
