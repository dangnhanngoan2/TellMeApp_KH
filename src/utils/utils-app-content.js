import moment from 'moment'
import { I18n } from 'tell-me-common'

const maxims = [
    'Nếu không có người bạn tốt thì ta khó mà biết được những sai lầm của bản thân.',
    'Người bạn sẽ dạy bạn, còn kẻ thù sẽ trừng phạt bạn.',
    'Không có bạn ư? Hãy đi tìm, nếu đã tìm thấy – hãy giữ gìn.',
    'Cuộc sống hạnh phúc tồn tại trong sự yên tĩnh tâm tư.',
    'Cuộc đời này ngắn lắm, cứ dám nghĩ to, ước lớn, không ai đánh thuế giấc mơ của bạn cả',
    'Bên cạnh người thân, bạn bè chính là sự tồn tại quan trọng nhất cuộc đời mỗi chúng ta',
    'Bạn có thể vấp ngã, có thể thất bại, có thể nản lòng nhưng đừng bao giờ bỏ cuộc',
    'Hạnh phúc là không chờ đợi, bạn phải nắm bắt hoặc không tự mình tạo ra nó',
    'Nếu không có mơ ước, có đam mê, làm sao bạn có thể có động lực mà bước tiếp?',
    'Nếu bạn không thể xây dựng một thành phố thì hãy xây lấy một trái tim hồng.',
    'Một người bạn thật sự là người bước vào cuộc sống của bạn khi cả thế giới đã bước ra.',
    'Yêu thương cho đi là yêu thương có thể giữ được mãi mãi.',
    'Nếu bạn không thể là Mặt Trời thì cũng đừng làm một đám mây.',
    'Sự chia sẻ và tình yêu thương là điều quý giá nhất trên đời.',
    'Ko tin vào chính mình – tức là bạn đã thất bại một nửa trước khi bắt đầu.',
    'Mọi thứ rồi sẽ qua đi, chỉ còn tình người ở lại.',
    'Hãy làm những việc bình thường bằng lòng say mê phi thường.',
    'Với thế giới, bạn chỉ là một hạt cát nhỏ – nhưng với một người nào đó, bạn là cả thế giới của họ.',
    'Người ta có thể quên đi điều bạn nói, nhưng những gì bạn để lại trong lòng họ thì ko bao giờ nhạt phai.',
    'Trong khi đau khổ, người ta nhận ra bạn bè .',
    'Con người trở nên cô đơn vì trong cuộc đời, thay vì xây những chiếc cầu người ta lại xây những bức tường.',

    'Hãy sống là chính mình, bình thường nhưng không tầm thường',
    'Đừng thở dài hãy vươn vai mà sống. Bùn dưới chân nhưng nắng ở trên đầu',
    'Sự lười biếng của bản thân như một cái rễ cây. Chúng nhanh chóng phát triển và ghìm chặt bạn tại một chỗ.',
    'Nơi lạnh nhất không phải là Bắc cực mà là nơi không có tình người',
    'Hôm nay đầy rẫy những khó khăn, và ngày mai cũng không có điều gì dễ dàng. Nhưng sau ngày mai, mọi thứ sẽ trở nên tốt đẹp.',
    'Cuộc sống và lòng tin chỉ bị mất có một lần.',
    'Nếu tự tin ở bản thân, bạn sẽ truyền niềm tin đến người khác.',
    'Hạnh phúc là cái gì thật mơ hồ khiến ta buộc phải mơ ước.',
    'Mỗi người là một kiến trúc sư cho hạnh phúc của mình.',
    'Một cách đơn giản để hạnh phúc là trân trọng những gì mình đang có.',
    'Được làm những điều bạn thích, đó là tự do. Thích được những điều bạn làm, đó là hạnh phúc.',
    'Chúng ta cảm thấy bất hạnh trong nỗi bất hạnh nhiều hơn là cảm thấy hạnh phúc trong niềm hạnh phúc.',
    'Hạnh phúc luôn mỉm cười với những ai kiên trì, dũng cảm, hăng say lao động.',
    'Hạnh phúc cũng giống như chiếc đồng hồ; loại ít phức tạp nhất là loại ít hỏng nhất.',
    'Hạnh phúc là gì? Là được yêu khi trẻ, toại nguyện khi đứng tuổi, dư dật khi về già và có tiền ở mọi lứa tuổi.',
    'Nỗi bất hạnh làm ra con người, còn con người làm ra hạnh phúc.',
    'Cái hạnh phúc giống như thủy tinh, càng rực rỡ bao nhiêu càng mỏng manh bấy nhiêu.',
    'Cuộc đời càng phức tạp thì những niềm vui sống càng đơn giản.',
    'Ngày nào chúng ta không cười, ngày đó chúng ta đã mất nhiều thứ.',
    'Tất cả mọi điều bạn làm để khiến cuộc sống của người khác trở nên tốt đẹp hơn đều khiến cho cuộc sống của bạn trở nên ý nghĩa hơn.',
    'Hãy học cách sống hạnh phúc với những gì bạn có trong khi vẫn theo đuổi những gì bạn muốn.',
    'Không phải những người đẹp là người hạnh phúc, mà những người hạnh phúc là những người đẹp.',
    'Đâu là hạnh phúc bạn đang có? Chúng ta chỉ cảm thấy giá trị thật sự của hạnh phúc cho đến khi chúng ta đã đánh mất hoặc sắp sửa mất nó.',
    'Hạnh phúc không có nghĩa là mọi việc đều hoàn hảo. Nó có nghĩa là bạn đã quyết định nhìn xa hơn những khiếm khuyết.',
    'Hạnh phúc đến thì lâu mà đi khỏi thì nhanh.',
    'Chúng ta biết mặt người chứ không biết tâm người.',
    'Không thể sống dễ chịu nếu không sống hợp lý, có đạo đức và đúng đắn.',
    'Ai nới rộng con tim thì phải thu hẹp cái miệng lại.',
    'Những giọt nước mắt khi rỏ ra một mình là chân thực nhất.',
    'Vết thương nặng nề và khó chạy chữa nhất, đó là đổ vỡ lương tâm.',

    'Với thế giới, bạn có thể chỉ là một người, nhưng với một người, bạn có thể là cả thế giới',
    'Yêu không chỉ là một danh từ – nó là một động từ; nó không chỉ là cảm xúc – nó là quan tâm, chia sẻ, giúp đỡ, hy sinh.',
    'Một nụ hôn phá tan khoảng cách giữa tình bạn và tình yêu',
    'Lực hấp dẫn không chịu trách nhiệm cho việc con người ta yêu nhau.',
    'Tình bạn có thể và thường phát triển thành tình yêu, nhưng tình yêu thì không bao giờ dịu đi thành tình bạn.',
    'Đàn ông mất phương hướng sau bốn ly rượu; đàn bà mất phương hướng sau bốn nụ hôn.',
    'Không ai yêu một người phụ nữ vì nàng đẹp hay nàng xấu, ngu ngốc hay thông minh. Chúng ta yêu vì chúng ta yêu.',
    'Những người yêu thương sâu sắc tin vào điều không thể.',
    'Tình yêu chúng ta có trong tuổi trẻ chỉ là hời hợt so với tình yêu mà một người đàn ông già nua dành cho người vợ già của mình.',
    'Vì sao chúng ta lại nhắm mắt khi ngủ, khi khóc, khi tưởng tượng, khi hôn nhau, khi cầu nguyện? Bởi vì những gì đẹp nhất trên thế gian này chẳng thể nào nhìn thấy bằng mắt mà phải được con tim cảm nhận.',
    'Nhớ một người là cách trái tim nhắc nhở rằng bạn yêu người ấy.',
    'Với phân tích cuối cùng, tình yêu là cuộc sống. Tình yêu không bao giờ thất bại và cuộc sống không bao giờ thất bại chừng nào còn có tình yêu.',
    'Tình yêu đến dù bạn muốn hay không. Đừng cố điều khiển nó!',
    'Cứ thử đi, ngươi không thể hủy diệt di tích vĩnh hằng của trái tim con người, tình yêu.',
    'Chỉ mất 3 giây để nói lời yêu, nhưng phải mất cả cuộc đời để chứng minh điều đó.',
    'Tình yêu tìm được thì tốt, nhưng không kiếm mà được còn tốt hơn nhiều.',
    'Chỉ có một thứ hạnh phúc trên đời, yêu và được yêu.',
    'Người ta nói tình yêu quan trọng hơn tiền bạc, nhưng bạn đã bao giờ thử thanh toán hóa đơn với một cái ôm chưa?',
    'Chỉ mất một phút để có cảm tình, một giờ để thích, một ngày để yêu – nhưng cả đời để quên đi ai đó.',
    'Nơi nào có hôn nhân mà không có tình yêu, ở đó xuất hiện tình yêu mà không có hôn nhân.',
    'Tình yêu là trò chơi mà ai cũng gian lận.',
    'Tình bạn luôn luôn là dầu xoa dịu tốt nhất cho nỗi đau vì thất vọng trong tình yêu.',
    'Tình bạn giống như được no bụng với món thịt bò quay; tình yêu giống như được rượu sâm panh làm phấn chấn.',
    'Nếu bạn yêu ai đó, hãy để họ ra đi. Nếu họ trở lại, họ sẽ luôn thuộc về bạn. Nếu họ không trở lại, họ chưa từng thuộc về bạn.',
    'Món quà lớn nhất mà bạn có thể trao cho người khác là món quà của tình yêu và sự chấp nhận vô điều kiện.',
    'Triệu chứng mạnh mẽ nhất của tình yêu là sự dịu dàng đôi lúc tới mức không chịu nổi.',
    'Nơi nào có tình yêu, nơi đó có sự sống.',
    'Sự tưởng tượng của phụ nữ diễn ra rất nhanh chóng; nó nhảy từ thán phục sang tình yêu, rồi từ tình yêu sang hôn nhân chỉ trong khoảnh khắc.',
    'Tình yêu thực sự luôn luôn làm người đàn ông trở nên tốt đẹp hơn, dù nó được người phụ nữ nào mang đến.',
    'Không có thuốc chữa cho tình yêu, trừ yêu nhiều hơn nữa.',
    'Tình yêu thực sự bắt đầu khi ta không trông chờ được đáp lại.',
    'Tình yêu giống như chiến tranh, dễ bắt đầu nhưng rất khó để dừng lại.',
    'Người nói yêu bạn, chưa chắc có thể đợi được bạn. Nhưng người đợi được bạn, chắc chắn sẽ rất yêu bạn.',
    'Cuộc sống có thể huy hoàng và choáng ngợp, đó là bi kịch. Không có cái đẹp, tình yêu hay nguy hiểm, sống hẳn sẽ thật dễ dàng.',
    'Cuộc đời là đóa hoa mà tình yêu là mật ngọt.',
    'Một trong những điều khó khăn nhất trong cuộc đời là nhìn người mình yêu yêu người khác.',
    'Để chiếm được trái tim người phụ nữ, người đàn ông đầu tiên phải dùng trái tim của mình.',
    'Em đã nắm giữ trái tim anh từ lời chào đầu tiên. Không gì có thể thay đổi điều đó. Ngay cả sự chia cách, thời gian, không gian. Không gì có thể đem trái tim anh rời khỏi em.',
    'Trong nghệ thuật cũng như trong tình yêu, bản năng là đủ.',
    'Tình yêu đẹp là khi bạn nhìn cả thế giới qua một người… Tình yêu xấu là khi bạn vì một người mà bỏ cả thế giới này.',


]

export const getGreetingTime = () => {
    const currentHour = parseFloat(moment().format('HH'))
    if (Number(currentHour) >= 12 && Number(currentHour) < 18) { return I18n.t('home.afternoon') }
    else if (Number(currentHour) >= 18) { return I18n.t('home.evening') }
    return I18n.t('home.morning')
}

export const getMaxim = () => {
    const number = getRandomizer(0, 90)
    if (maxims[number]) {
        return maxim = maxims[number]
    }
    return maxim = maxims[6]
}

function getRandomizer(bottom, top) {
    return Math.floor(Math.random() * (1 + top - bottom)) + bottom;
}

export let maxim = '';
