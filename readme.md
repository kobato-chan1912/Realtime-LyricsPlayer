Mò mẫm cuối cùng cũng xong :3 chợt tách được con api nên làm luôn cái app nhẹ search => get src bài hát trả về lyrics :3
Tại lâu rồi cũng không tham gia mấy vụ reverse này kia nên cũng quên nhẹ mấy cái sha256 này kia nên cũng hơi quần xíu :))) 
Nói chung là app sẽ get get quả đầu tiên được search => trả về src và lyrics như hình qua API vừa tách. 
Main stack:
- Front-end: jquery.  
- Back-end: Yii.
- npm:
+ lrc-file-parser hỗ trợ parser LRC. 
+ nodeJS hỗ trợ crawl api (/với puppeteer extra)

Setting headless: 

const chromeOptions = {
  headless:false,
  defaultViewport: null};
(async function main() {
    // main crawl here
})()

Sẽ update git với deploy sau :3 giờ đi coi bóng banh :(

=> Hướng mở rộng (có thể sẽ làm sau):
+ Web RTC / Socket.io => get buffer để keep streaming online. 
+ Chatbox qua Firebase hoặc Pusher Service. 
+ Queue (hàng đợi) => Chọn bài hát vào hàng đợi.