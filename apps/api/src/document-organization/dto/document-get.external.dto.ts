interface Organization {
  ЮЛ: {
    ИНН: string;
    ОГРН: string;
    НаимСокрЮЛ: string;
    НаимПолнЮЛ: string;
    ДатаОГРН: string;
    Статус: string;
    АдресПолн: string;
    ОснВидДеят: string;
    ГдеНайдено: string;
  };
}

interface OrganizationResponse {
  items: Organization[];
  Count: number;
}