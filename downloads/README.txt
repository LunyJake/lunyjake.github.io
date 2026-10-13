DOWNLOAD FILE PLACEHOLDERS — Justin's Windows Lab

The website ZIP does not contain Windows ISO files or autounattend XML files.

If you want LOCAL file downloads, place these four actual files in this folder:
  personal-pc.iso        (PC Windows ISO)
  personal-laptop.iso    (Laptop Windows ISO)
  personal-pc.xml        (PC autounattend answer file)
  personal-laptop.xml    (Laptop autounattend answer file)

The four download cards in iso-personal.html currently use those relative paths.
If you instead host the files elsewhere, replace the relevant href="downloads/..."
with the URL of the file you host. Avoid changing the surrounding HTML.

The downloadable XML filenames will be presented to the browser as
  autounattend-pc.xml and autounattend-laptop.xml.
For an unattended installation, the file typically needs to be renamed to
  autounattend.xml when placed at the root of installation media.

The only documented PC/Laptop difference on the web page is Windows Hello:
removed on PC and retained on Laptop (per the supplied description).
