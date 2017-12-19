export const prizeHtml = prizeInfo => {
  if (!prizeInfo) prizeInfo = ""
  const html = `<div style="background: #f0f0f0;font-family: Arial, Helvetica, sans-serif;padding-top: 40px;"><div style="background: #fff; max-width: 680px; margin: 0 auto;"><div style="width: 100%; margin: 0 auto; padding: 10px 0; border-bottom: 1px solid #ddd;"><img src="http://edm.gobear.com/mailings/1/115/images/logo.png" alt="GoBear Logo" width="99" height="48" style="display: block; margin: 0 auto;">
<h1>Congratulation!</h1>
${prizeInfo}
</div>
`
  return html
}
