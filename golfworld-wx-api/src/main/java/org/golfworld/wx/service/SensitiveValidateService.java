package org.golfworld.wx.service;

import cn.binarywang.wx.miniapp.api.WxMaService;
import me.chanjar.weixin.common.error.WxErrorException;
import org.apache.commons.io.IOUtils;
import org.golfworld.wx.dto.SensitiveValidateResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class SensitiveValidateService {
    @Autowired
    private WxMaService wxMaService;

    @Value("${application.wx.app-id}")
    private String appId;

    @Value("${application.wx.app-secret}")
    private String appSecret;

    private String validateTextUrl = "https://api.weixin.qq.com/wxa/msg_sec_check?access_token=";
    private String validateImageUrl = "https://api.weixin.qq.com/wxa/img_sec_check?access_token=";


    public Boolean validateText(String text) throws WxErrorException {
        if (StringUtils.isEmpty(text)) return true;
        String token = wxMaService.getAccessToken();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON_UTF8);
        String content = "{ \"content\": \"" + text + "\"}";
        HttpEntity<String> request = new HttpEntity<>(content, headers);
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<SensitiveValidateResult> responseEntity = restTemplate.postForEntity(validateTextUrl + token, request, SensitiveValidateResult.class);
        SensitiveValidateResult sensitiveValidateResult = responseEntity.getBody();
        return sensitiveValidateResult.isPass();
    }

    public Boolean validateImage(MultipartFile file) throws WxErrorException, IOException {
        if (file == null) {
            return false;
        }
        HttpHeaders headers = new HttpHeaders();
        String token = wxMaService.getAccessToken();
        MediaType type = MediaType.parseMediaType("multipart/form-data");
        headers.setContentType(type);
        MultiValueMap<String, Object> form = new LinkedMultiValueMap<>();
        ByteArrayResource contentsAsResource = new ByteArrayResource(IOUtils.toByteArray(file.getInputStream())) {
            @Override
            public String getFilename() {
                return "img";
            }
        };
        form.add("name", contentsAsResource);
        RestTemplate restTemplate = new RestTemplate();
        HttpEntity<MultiValueMap<String, Object>> files = new HttpEntity<>(form, headers);
        ResponseEntity<SensitiveValidateResult> responseResponseEntity = restTemplate.postForEntity(validateImageUrl + token, files, SensitiveValidateResult.class);
        SensitiveValidateResult sensitiveValidateResult = responseResponseEntity.getBody();
        return sensitiveValidateResult.isPass();
    }
}
