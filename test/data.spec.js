describe('socialNetwork', () => {
  it('debería exponer función getCurrentUserData', () => {
    assert.isFunction(getCurrentUserData);
  });

  it('debería exponer función addLikeToPost', () => {
    assert.isFunction(addLikeToPost);
  });

  it('debería exponer función addCommentToPost', () => {
    assert.isFunction(addCommentToPost);
  });
});