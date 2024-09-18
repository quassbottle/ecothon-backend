const WELCOME = `

<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Моя тестовая страница</title>
    <style>
      .banner-img {
        width: 600px;
        height: 200px;
        object-fit: cover; /* Масштабирует изображение, чтобы оно полностью заполнило контейнер */
      }
    </style>
  </head>
  <body bgcolor="#D9D9D9">
    <table cellpadding="0" cellspacing="0" width="80%" bgcolor="#FFFFFF">
      <tr>
        <th height="25px" style="background-color: rgba(21, 176, 151, 1.0);">
        </th>
      </tr>
      <tr>
        <td width="100%" height="60px" align="center">
          <img class="banner-img" src="{{banner}}" alt="Banner" />
        </td>
      </tr>
      <tr>
        <td id="namePlace" width="100%" align="center" style="font-size: 20pt;">
          {{greetings}}
        </td>
      </tr>
      <tr>
        <td id="textPlace" width="100%" align="center" style="font-size: 16pt;">
          {{mainText}}
        </td>
      </tr>
    </table>
  </body>
</html>
`;

export const welcomeTemplate = (params: {
  banner: string;
  greetings: string;
  mainText: string;
}) => {
  return WELCOME.replace('{{banner}}', params.banner)
    .replace('{{greetings}}', params.greetings)
    .replace('{{mainText}}', params.mainText);
};
