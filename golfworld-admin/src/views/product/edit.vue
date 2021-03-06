<template>
  <div class="app-container">

    <el-card class="box-card">
      <h3>商品介绍</h3>
      <el-form ref="product" :rules="rules" :model="product" label-width="150px">
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="product.name" />
        </el-form-item>
        <el-form-item label="市场价" prop="officialPrice">
          <el-input v-model="product.officialPrice" placeholder="" />
        </el-form-item>
        <el-form-item label="折扣价" prop="discountPrice">
          <el-input v-model="product.discountPrice" placeholder="" />
        </el-form-item>
        <el-form-item label="货币">
          <el-select v-model="product.currency" clearable>
            <el-option v-for="item in currencyList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否新品" prop="isNew">
          <el-radio-group v-model="product.isNew">
            <el-radio :label="true">新品</el-radio>
            <el-radio :label="false">非新品</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="发布时间" prop="releaseTime">
          <el-date-picker v-model="product.releaseTime" type="date" value-format="yyyy-MM-dd" placeholder="选择时间" />
        </el-form-item>
        <el-form-item label="是否热卖" prop="isHot">
          <el-radio-group v-model="product.isHot">
            <el-radio :label="false">普通</el-radio>
            <el-radio :label="true">热卖</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否在售" prop="isOnSale">
          <el-radio-group v-model="product.isOnSale">
            <el-radio :label="true">在售</el-radio>
            <el-radio :label="false">未售</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="商品图片">
          <el-upload
            :headers="headers"
            :action="uploadPath"
            :show-file-list="false"
            :on-progress="showPicLoading"
            :on-success="uploadPicUrl"
            class="avatar-uploader"
            accept=".jpg,.jpeg,.png,.gif"
          >
            <img v-if="showLoading" :src="picLoading" class="loading avatar">
            <img v-if="product.picUrl && !showLoading" :src="product.picUrl" class="avatar">
            <i v-if=" !product.picUrl && !showLoading" class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>

        <el-form-item label="宣传画廊">
          <el-upload
            :action="uploadPath"
            :headers="headers"
            :limit="5"
            :file-list="galleryFileList"
            :on-exceed="uploadOverrun"
            :on-success="handleGalleryUrl"
            :on-remove="handleRemove"
            multiple
            accept=".jpg,.jpeg,.png,.gif"
            list-type="picture-card"
          >
            <i class="el-icon-plus" />
          </el-upload>
        </el-form-item>

        <el-form-item label="关键字">
          <el-tag v-for="tag in keywords" :key="tag" closable type="primary" @close="handleClose(tag)">
            {{ tag }}
          </el-tag>
          <el-input
            v-if="newKeywordVisible"
            ref="newKeywordInput"
            v-model="newKeyword"
            class="input-new-keyword"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          />
          <el-button v-else class="button-new-keyword" type="primary" @click="showInput">+ 增加</el-button>
        </el-form-item>

        <el-form-item label="所属分类">
          <el-cascader
            v-model="categoryIds"
            :options="categoryList"
            clearable
            expand-trigger="hover"
            @change="handleCategoryChange"
          />
        </el-form-item>

        <el-form-item label="所属品牌商">
          <el-select v-model="product.brandId" clearable>
            <el-option v-for="item in brandList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item label="商品简介">
          <el-input v-model="product.brief" />
        </el-form-item>

        <el-form-item label="商品详细介绍">
          <editor v-model="product.detail" :init="editorInit" />
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="box-card">
      <h3>商品参数</h3>
      <el-button type="primary" @click="handleAttributeShow">添加</el-button>
      <el-table :data="attributesData">
        <el-table-column property="attribute" label="商品参数名称" />
        <el-table-column property="value" label="商品参数值" />
        <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleAttributeShow(scope.row)">设置</el-button>
            <el-button type="danger" size="mini" @click="handleAttributeDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog :visible.sync="attributeVisiable" :title="attributeAdd ? '添加商品参数' : '编辑商品参数'">
        <el-form
          ref="attributeForm"
          :model="attributeForm"
          status-icon
          label-position="left"
          label-width="100px"
          style="width: 600px; margin-left:50px;"
        >
          <el-form-item label="商品参数名称" prop="attribute">
            <el-input v-model="attributeForm.attribute" />
          </el-form-item>
          <el-form-item label="商品参数值" prop="value">
            <el-input
              v-model="attributeForm.value"
              type="textarea"
              :show-word-limit="true"
              :maxlength="1000"
              :rows="7"
            />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="attributeVisiable = false">取消</el-button>
          <el-button v-if="attributeAdd" type="primary" @click="handleAttributeAdd">确定</el-button>
          <el-button v-else type="primary" @click="handleAttributeEdit">确定</el-button>
        </div>
      </el-dialog>
    </el-card>

    <div class="op-container">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleEdit">更新商品</el-button>
    </div>

  </div>
</template>

<style>
  .el-card {
    margin-bottom: 10px;
  }

  .el-tag + .el-tag {
    margin-left: 10px;
  }

  .input-new-keyword {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
  }

  .avatar {
    width: 145px;
    height: 145px;
    display: block;
  }

  .op-container {
    display: flex;
    justify-content: center;
  }

  .loading {
    max-width: 100%;
    max-height: 100%;
  }
</style>

<script>
import { detailProduct, editProduct, listCatAndBrand } from '@/api/product'
import { createStorage, uploadPath } from '@/api/storage'
import Editor from '@tinymce/tinymce-vue'
import { MessageBox } from 'element-ui'
import { getToken } from '@/utils/auth'
import picLoading from '@/assets/loading.gif'

export default {
  name: 'ProductEdit',
  components: { Editor },
  data() {
    return {
      uploadPath,
      showLoading: false,
      picLoading,
      newKeywordVisible: false,
      newKeyword: '',
      keywords: [],
      galleryFileList: [],
      categoryList: [],
      brandList: [],
      categoryIds: [],
      currencyList: [
        {
          label: '人民币',
          value: 'RMB'
        },
        {
          label: '新西兰元',
          value: 'NZD'
        }, {
          label: '美元',
          value: 'USD'
        }
      ],
      product: { gallery: [] },
      productVisiable: false,
      productForm: {
        id: 0,
        discountPrice: null,
        number: 0,
        url: ''
      },
      products: [
        { id: 0, discountPrice: null, number: 0, url: '' }
      ],
      attributeVisiable: false,
      attributeAdd: true,
      attributeForm: { attribute: '', value: '' },
      attributes: [],
      rules: {
        name: [{ required: true, message: '商品名称不能为空', trigger: 'blur' }]
      },
      editorInit: {
        language: 'zh_CN',
        height: '400px',
        convert_urls: false,
        plugins: [
          'advlist anchor autolink autosave code codesample colorpicker colorpicker contextmenu directionality emoticons fullscreen hr image imagetools importcss insertdatetime link lists media nonbreaking noneditable pagebreak paste preview print save searchreplace spellchecker tabfocus table template textcolor textpattern visualblocks visualchars wordcount'
        ],
        toolbar: [
          'searchreplace bold italic underline strikethrough alignleft aligncenter alignright outdent indent  blockquote undo redo removeformat subscript superscript code codesample',
          'hr bullist numlist link image charmap preview anchor pagebreak insertdatetime media table emoticons forecolor backcolor fullscreen'
        ],
        images_upload_handler: function(blobInfo, success, failure) {
          const formData = new FormData()
          formData.append('file', blobInfo.blob())
          createStorage(formData)
            .then(res => {
              success(res.data.data.url)
            })
            .catch(() => {
              failure('上传失败，请重新上传')
            })
        }
      }
    }
  },
  computed: {
    headers() {
      return {
        'X-Admin-Token': getToken()
      }
    },
    attributesData() {
      var attributesData = []
      for (var i = 0; i < this.attributes.length; i++) {
        if (this.attributes[i].deleted) {
          continue
        }
        attributesData.push(this.attributes[i])
      }
      return attributesData
    }
  },
  created() {
    this.init()
  },
  methods: {
    init: function() {
      if (this.$route.query.id == null) {
        return
      }

      const productId = this.$route.query.id
      detailProduct(productId).then(response => {
        this.product = response.data.data.product
        // 稍微调整一下前后端不一致
        if (this.product.brandId === 0) {
          this.product.brandId = null
        }
        if (this.product.keywords === '') {
          this.product.keywords = null
        }

        this.products = response.data.data.products
        this.attributes = response.data.data.attributes
        this.categoryIds = response.data.data.categoryIds

        this.galleryFileList = []
        this.product.gallery = JSON.parse(this.product.gallery)
        for (var i = 0; i < this.product.gallery.length; i++) {
          this.galleryFileList.push({
            url: this.product.gallery[i]
          })
        }
        const keywords = response.data.data.product.keywords
        if (keywords !== null) {
          this.keywords = keywords.split(',')
        }
      })

      listCatAndBrand().then(response => {
        this.categoryList = response.data.data.categoryList
        this.brandList = response.data.data.brandList
      })
    },
    handleCategoryChange(value) {
      this.product.categoryId = value[value.length - 1]
    },
    showPicLoading: function() {
      this.showLoading = true
    },
    handleCancel: function() {
      this.$router.push({ path: '/product/list' })
    },
    handleEdit: function() {
      const gallery = this.product.gallery
      this.stringProductGalleryUrl()
      const finalProduct = {
        product: this.product,
        products: this.products,
        attributes: this.attributes
      }
      editProduct(finalProduct)
        .then(response => {
          this.$notify.success({
            title: '成功',
            message: '更新成功'
          })
          this.$router.push({ path: '/product/list' })
        })
        .catch(response => {
          this.product.gallery = gallery
          MessageBox.alert('业务错误：' + response.data.errmsg, '警告', {
            confirmButtonText: '确定',
            type: 'error'
          })
        })
    },
    stringProductGalleryUrl() {
      if (this.product.gallery.length > 0) {
        this.product.gallery = JSON.stringify(this.product.gallery)
      } else {
        this.product.gallery = '[]'
      }
    },
    handleClose(tag) {
      this.keywords.splice(this.keywords.indexOf(tag), 1)
      this.product.keywords = this.keywords.toString()
    },
    showInput() {
      this.newKeywordVisible = true
      this.$nextTick(_ => {
        this.$refs.newKeywordInput.$refs.input.focus()
      })
    },
    handleInputConfirm() {
      const newKeyword = this.newKeyword
      if (newKeyword) {
        this.keywords.push(newKeyword)
        this.product.keywords = this.keywords.toString()
      }
      this.newKeywordVisible = false
      this.newKeyword = ''
    },
    uploadPicUrl: function(response) {
      this.showLoading = false
      this.product.picUrl = response.data.url
    },
    uploadOverrun: function() {
      this.$message({
        type: 'error',
        message: '上传文件个数超出限制!最多上传5张图片!'
      })
    },
    handleGalleryUrl(response, file, fileList) {
      if (response.errno === 0) {
        this.product.gallery.push(response.data.url)
      }
    },
    handleRemove: function(file, fileList) {
      for (var i = 0; i < this.product.gallery.length; i++) {
        // 这里存在两种情况
        // 1. 如果所删除图片是刚刚上传的图片，那么图片地址是file.response.data.url
        //    此时的file.url虽然存在，但是是本机地址，而不是远程地址。
        // 2. 如果所删除图片是后台返回的已有图片，那么图片地址是file.url
        var url
        if (file.response === undefined) {
          url = file.url
        } else {
          url = file.response.data.url
        }

        if (this.product.gallery[i] === url) {
          this.product.gallery.splice(i, 1)
        }
      }
    },
    handleProductShow(row) {
      this.productForm = Object.assign({}, row)
      this.productVisiable = true
    },
    uploadProductUrl: function(response) {
      this.productForm.url = response.data.url
    },
    handleProductEdit() {
      this.productForm.updateTime = ''
      for (var i = 0; i < this.products.length; i++) {
        const v = this.products[i]
        if (v.id === this.productForm.id) {
          this.products.splice(i, 1, this.productForm)
          break
        }
      }
      this.productVisiable = false
    },
    handleAttributeShow(row) {
      if (row.id) {
        this.attributeForm = Object.assign({}, row)
        this.attributeAdd = false
      } else {
        this.attributeForm = {}
        this.attributeAdd = true
      }
      this.attributeVisiable = true
    },
    handleAttributeAdd() {
      this.attributes.unshift(this.attributeForm)
      this.attributeVisiable = false
    },
    handleAttributeEdit() {
      // 这是一个trick，设置updateTime的值为空，告诉后端这个记录已编辑需要更新。
      this.attributeForm.updateTime = ''
      for (var i = 0; i < this.attributes.length; i++) {
        const v = this.attributes[i]
        if (v.id === this.attributeForm.id) {
          this.attributes.splice(i, 1, this.attributeForm)
          break
        }
      }
      this.attributeVisiable = false
    },
    handleAttributeDelete(row) {
      row.deleted = true
    }
  }
}
</script>
